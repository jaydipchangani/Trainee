using System;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Windows.Forms;

public class AIUsageData
{
    public long aiTime { get; set; }
    public long totalTime { get; set; }
    public int tabsOpened { get; set; }
    public int tabsClosed { get; set; }

    public LastAIUsed lastAIUsed { get; set; }
    public Dictionary<string, long> aiUsage { get; set; }
}

public class LastAIUsed
{
    public string website { get; set; }
    public long timestamp { get; set; }
}

namespace AIUsageMonitor
{
    public partial class Form1 : Form
    {
        private static readonly HttpClient client = new HttpClient();

        public Form1()
        {
            InitializeComponent();
            FetchData(); // Fetch data on startup

            // **Explicitly specifying Windows Forms Timer**
            System.Windows.Forms.Timer timer = new System.Windows.Forms.Timer
            {
                Interval = 10000 // Refresh every 10 seconds
            };
            timer.Tick += async (sender, e) => await FetchData();
            timer.Start();
        }

        private async Task FetchData()
        {
            try
            {
                string response = await client.GetStringAsync("http://localhost:3000/get-data");
                AIUsageData data = JsonConvert.DeserializeObject<AIUsageData>(response);

                lblTotalTime.Text = $"Total Time: {data.totalTime / 1000} sec";
                lblAITime.Text = $"AI Time: {data.aiTime / 1000} sec";
                lblTabsOpened.Text = $"Tabs Opened: {data.tabsOpened}";
                lblTabsClosed.Text = $"Tabs Closed: {data.tabsClosed}";

                // ✅ Check if `lastAIUsed` is null before using it
                if (data.lastAIUsed != null)
                {
                    lblLastUsed.Text = $"Last Used: {data.lastAIUsed.website} at {DateTimeOffset.FromUnixTimeMilliseconds(data.lastAIUsed.timestamp)}";
                }
                else
                {
                    lblLastUsed.Text = "Last Used: No data available";
                }

                // ✅ Ensure `aiUsage` is not null before looping
                lstAIUsage.Items.Clear();
                if (data.aiUsage != null)
                {
                    foreach (var entry in data.aiUsage)
                    {
                        lstAIUsage.Items.Add($"{entry.Key}: {entry.Value / 1000} sec");
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error fetching data: " + ex.Message);
            }
        }

    }
}
