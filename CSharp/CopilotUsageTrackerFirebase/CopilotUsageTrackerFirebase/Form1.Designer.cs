using Google.Cloud.Firestore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace CopilotUsageTracker
{
    public class FirestoreService
    {
        private FirestoreDb _firestoreDb;
        private string jsonFilePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "data.json");

        public FirestoreService()
        {
            string path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "firebase-config.json");
            Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", path);
            _firestoreDb = FirestoreDb.Create("your-project-id"); // Replace with your Firebase project ID
        }

        // Fetch all data from Firebase and save it as JSON
        public async Task DownloadAllData()
        {
            Dictionary<string, Dictionary<string, UsageData>> allUsersData = new Dictionary<string, Dictionary<string, UsageData>>();

            CollectionReference usersCollection = _firestoreDb.Collection("copilotUsage");
            QuerySnapshot usersSnapshot = await usersCollection.GetSnapshotAsync();

            foreach (DocumentSnapshot userDoc in usersSnapshot.Documents)
            {
                string username = userDoc.Id;
                Dictionary<string, UsageData> userUsageData = new Dictionary<string, UsageData>();

                CollectionReference usageRecords = userDoc.Reference.Collection("usageRecords");
                QuerySnapshot usageRecordsSnapshot = await usageRecords.GetSnapshotAsync();

                foreach (DocumentSnapshot recordDoc in usageRecordsSnapshot.Documents)
                {
                    string date = recordDoc.Id;
                    Dictionary<string, object> data = recordDoc.ToDictionary();

                    UsageData usageData = new UsageData
                    {
                        TotalUsageTime = data.ContainsKey("totalUsageTime") ? data["totalUsageTime"].ToString() : "00:00:00",
                        CopilotUsageTime = data.ContainsKey("copilotUsageTime") ? data["copilotUsageTime"].ToString() : "00:00:00"
                    };

                    userUsageData[date] = usageData;
                }

                allUsersData[username] = userUsageData;
            }

            // Save data to JSON file
            string json = JsonConvert.SerializeObject(allUsersData, Formatting.Indented);
            File.WriteAllText(jsonFilePath, json);
        }

        // Read data from JSON file
        public UsageData GetUsageDataFromJson(string username, string date)
        {
            if (!File.Exists(jsonFilePath))
            {
                return new UsageData { TotalUsageTime = "00:00:00", CopilotUsageTime = "00:00:00" };
            }

            string json = File.ReadAllText(jsonFilePath);
            var allUsersData = JsonConvert.DeserializeObject<Dictionary<string, Dictionary<string, UsageData>>>(json);

            if (allUsersData.ContainsKey(username) && allUsersData[username].ContainsKey(date))
            {
                return allUsersData[username][date];
            }

            return new UsageData { TotalUsageTime = "00:00:00", CopilotUsageTime = "00:00:00" };
        }
    }

    public class UsageData
    {
        public string TotalUsageTime { get; set; }
        public string CopilotUsageTime { get; set; }
    }
}
