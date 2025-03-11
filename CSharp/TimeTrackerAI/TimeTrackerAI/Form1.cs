using System;
using System.IO;
using System.Windows.Forms;
using Newtonsoft.Json;

namespace AIUsageMonitor
{
    public partial class Form1 : Form
    {
        private string jsonFilePath = @"C:\Users\YourUsername\Documents\ai_usage_data.json"; // 🔹 Update this path

        public Form1()
        {
            InitializeComponent();
            LoadData();  // 🔹 Call this method to load and display data
        }

        private void LoadData()
        {
            try
            {
                if (!File.Exists(jsonFilePath))
                {
                    MessageBox.Show("Data file not found!", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    return;
                }

                string jsonData = File.ReadAllText(jsonFilePath);
                var aiUsageData = JsonConvert.DeserializeObject<AIUsageData>(jsonData);

                if (aiUsageData != null)
                {
                    lblDate.Text = "Date: " + aiUsageData.date;
                    lblTotalTime.Text = "Total Time: " + aiUsageData.total_time_spent;
                    lblAITime.Text = "AI Time: " + aiUsageData.ai_time_spent;
                    lblTabsOpened.Text = "Tabs Opened: " + aiUsageData.tabs_opened;
                    lblTabsClosed.Text = "Tabs Closed: " + aiUsageData.tabs_closed;
                    lblLastUsed.Text = "Last AI Used: " + aiUsageData.last_ai_used;

                    lstAIUsage.Items.Clear();
                    foreach (var ai in aiUsageData.ai_usage)
                    {
                        lstAIUsage.Items.Add($"{ai.name} - {ai.time_spent}");
                    }
                }
                else
                {
                    MessageBox.Show("Invalid JSON format!", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Error reading data: " + ex.Message, "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }
    }

    public class AIUsageData
    {
        public string date { get; set; }
        public string total_time_spent { get; set; }
        public string ai_time_spent { get; set; }
        public int tabs_opened { get; set; }
        public int tabs_closed { get; set; }
        public string last_ai_used { get; set; }
        public AIUsage[] ai_usage { get; set; }
    }

    public class AIUsage
    {
        public string name { get; set; }
        public string time_spent { get; set; }
    }
}
