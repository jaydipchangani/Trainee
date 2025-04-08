using Newtonsoft.Json.Linq;
using System.Data.SqlClient;
using System.Net.Http.Headers;

namespace QuickBookAPI.Services
{
    public interface IAccountService
    {
        Task SyncAccountsAsync();
    }

    public class AccountService : IAccountService
    {
        private readonly IConfiguration _config;
        private readonly IHttpClientFactory _httpClientFactory;

        public AccountService(IConfiguration config, IHttpClientFactory httpClientFactory)
        {
            _config = config;
            _httpClientFactory = httpClientFactory;
        }

        public async Task SyncAccountsAsync()
        {
            var token = _config["QuickBooks:AccessToken"];
            var realmId = _config["QuickBooks:RealmId"];
            var baseUrl = _config["QuickBooks:BaseUrl"];
            var connStr = _config.GetConnectionString("DefaultConnection");

            string query = "select * from Account";
            string url = $"{baseUrl}/v3/company/{realmId}/query?query={Uri.EscapeDataString(query)}";

            var client = _httpClientFactory.CreateClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var response = await client.GetAsync(url);
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            var json = JObject.Parse(content);
            var accounts = json["QueryResponse"]["Account"] as JArray;

            using var conn = new SqlConnection(connStr);
            conn.Open();

            foreach (var acc in accounts)
            {
                var cmd = new SqlCommand(@"
                IF NOT EXISTS (SELECT 1 FROM QuickBooksAccounts WHERE Id = @Id)
                INSERT INTO QuickBooksAccounts (
                    Id, Name, FullyQualifiedName, AccountType, AccountSubType, Classification,
                    CurrencyName, CurrencyValue, CurrentBalance, CurrentBalanceWithSubAccounts,
                    Active, SubAccount, SyncToken, Domain, CreateTime, LastUpdatedTime
                ) VALUES (
                    @Id, @Name, @FullyQualifiedName, @AccountType, @AccountSubType, @Classification,
                    @CurrencyName, @CurrencyValue, @CurrentBalance, @CurrentBalanceWithSubAccounts,
                    @Active, @SubAccount, @SyncToken, @Domain, @CreateTime, @LastUpdatedTime
                )", conn);

                cmd.Parameters.AddWithValue("@Id", (int)acc["Id"]);
                cmd.Parameters.AddWithValue("@Name", (string)acc["Name"]);
                cmd.Parameters.AddWithValue("@FullyQualifiedName", (string)acc["FullyQualifiedName"]);
                cmd.Parameters.AddWithValue("@AccountType", (string)acc["AccountType"]);
                cmd.Parameters.AddWithValue("@AccountSubType", (string)acc["AccountSubType"]);
                cmd.Parameters.AddWithValue("@Classification", (string)acc["Classification"]);
                cmd.Parameters.AddWithValue("@CurrencyName", (string?)acc["CurrencyRef"]?["name"] ?? "");
                cmd.Parameters.AddWithValue("@CurrencyValue", (string?)acc["CurrencyRef"]?["value"] ?? "");
                cmd.Parameters.AddWithValue("@CurrentBalance", (decimal)acc["CurrentBalance"]);
                cmd.Parameters.AddWithValue("@CurrentBalanceWithSubAccounts", (decimal)acc["CurrentBalanceWithSubAccounts"]);
                cmd.Parameters.AddWithValue("@Active", (bool)acc["Active"]);
                cmd.Parameters.AddWithValue("@SubAccount", (bool)acc["SubAccount"]);
                cmd.Parameters.AddWithValue("@SyncToken", (string)acc["SyncToken"]);
                cmd.Parameters.AddWithValue("@Domain", (string)acc["domain"]);
                cmd.Parameters.AddWithValue("@CreateTime", (DateTime)acc["MetaData"]["CreateTime"]);
                cmd.Parameters.AddWithValue("@LastUpdatedTime", (DateTime)acc["MetaData"]["LastUpdatedTime"]);

                await cmd.ExecuteNonQueryAsync();
            }
        }
    }
}
