using System;
using System.IO;
using System.Linq;
using System.Windows.Forms;
using Newtonsoft.Json.Linq;
using System.Windows.Forms.DataVisualization.Charting;

namespace AIUsageMonitor
{
    public partial class Form1 : Form
    {
        private JObject jsonData; // Store JSON data
        private System.Windows.Forms.DataVisualization.Charting.Chart chartAIUsage;


        public Form1()
        {
            InitializeComponent();
            cmbSelectDate.SelectedIndexChanged += cmbSelectDate_SelectedIndexChanged; // Attach event
        }

        private void btnLoadData_Click(object sender, EventArgs e)
        {
            using (OpenFileDialog openFileDialog = new OpenFileDialog())
            {
                openFileDialog.Filter = "JSON files (*.json)|*.json";
                openFileDialog.Title = "Select AI Usage JSON File";

                if (openFileDialog.ShowDialog() == DialogResult.OK)
                {
                    try
                    {
                        string jsonContent = File.ReadAllText(openFileDialog.FileName);
                        jsonData = JObject.Parse(jsonContent); // Parse JSON

                        // Populate ComboBox with available dates
                        cmbSelectDate.Items.Clear();
                        foreach (var date in jsonData.Properties().Select(p => p.Name))
                        {
                            cmbSelectDate.Items.Add(date);
                        }

                        if (cmbSelectDate.Items.Count > 0)
                        {
                            cmbSelectDate.SelectedIndex = 0; // Select first date automatically
                        }
                    }
                    catch (Exception ex)
                    {
                        MessageBox.Show("Error loading JSON file: " + ex.Message, "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    }
                }
            }
        }

        private void UpdateChart(JObject data)
        {
            chartAIUsage.Series.Clear();  // Clear old data
            var series = new System.Windows.Forms.DataVisualization.Charting.Series("AI Usage")
            {
                ChartType = System.Windows.Forms.DataVisualization.Charting.SeriesChartType.Pie
            };

            if (data["aiUsage"] is JObject aiUsage)
            {
                foreach (var ai in aiUsage)
                {
                    string aiName = ai.Key;
                    double usageTime = Convert.ToDouble(ai.Value);

                    series.Points.AddXY(aiName, usageTime);
                }
            }

            chartAIUsage.Series.Add(series);
        }



        private void cmbSelectDate_SelectedIndexChanged(object sender, EventArgs e)
        {

            if (cmbSelectDate.SelectedItem == null || jsonData == null)
            {
                MessageBox.Show("No data available for the selected date.", "Error", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            string selectedDate = cmbSelectDate.SelectedItem.ToString();
            if (!jsonData.ContainsKey(selectedDate))
            {
                MessageBox.Show("No data found for the selected date.", "Error", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            var selectedData = jsonData[selectedDate];

            lblDate.Text = "Date: " + selectedDate;

            // ✅ Convert time to HH:MM:SS
            int totalTimeMs = selectedData["totalTime"]?.Value<int>() ?? 0;
            int aiTimeMs = selectedData["aiTime"]?.Value<int>() ?? 0;
            lblTotalTime.Text = "Total Time: " + ConvertToHHMMSS(totalTimeMs);
            lblAITime.Text = "AI Time: " + ConvertToHHMMSS(aiTimeMs);
            lblTabsOpened.Text = "Tabs Opened: " + (selectedData["tabsOpened"]?.ToString() ?? "N/A");
            lblTabsClosed.Text = "Tabs Closed: " + (selectedData["tabsClosed"]?.ToString() ?? "N/A");
            lblLastUsed.Text = "Last AI Used: " + (selectedData["lastAIUsed"]?["website"]?.ToString() ?? "N/A");

            // ✅ Update AI Usage List
            lstAIUsage.Items.Clear();
            chartAIUsage.Series["AI Usage"].Points.Clear(); // Clear previous data

            if (selectedData["aiUsage"] is JObject aiUsage && aiUsage.Count > 0)
            {
                foreach (var ai in aiUsage)
                {
                    string aiName = ai.Key;
                    int aiTime = ai.Value?.ToObject<int>() ?? 0;
                    string aiTimeFormatted = ConvertToHHMMSS(aiTime);

                    lstAIUsage.Items.Add($"{aiName}: {aiTimeFormatted}");

                    // ✅ Add AI data to Pie Chart
                    chartAIUsage.Series["AI Usage"].Points.AddXY(aiName, aiTime);
                }
            }
            else
            {
                lstAIUsage.Items.Add("No AI Usage Data");
            }


        }

        private string ConvertToHHMMSS(int milliseconds)
        {
            TimeSpan time = TimeSpan.FromMilliseconds(milliseconds);
            return $"{time.Hours:D2}:{time.Minutes:D2}:{time.Seconds:D2}";
        }

       

    }
}
