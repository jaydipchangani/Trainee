using System;
using System.IO;
using System.Windows.Forms;
using System.Threading.Tasks;
using LiveCharts;
using LiveCharts.WinForms; // Use WinForms version
using LiveCharts.Wpf; // REMOVE THIS if you are NOT using WPF!

namespace CopilotUsageTracker
{
    public partial class MainForm : Form
    {
        private FirestoreService _firestoreService;
        private ComboBox usernameDropdown;
        private DateTimePicker datePicker;
        private Button fetchButton;
        private Button downloadButton;
        private Label totalTimeLabel;
        private Label copilotTimeLabel;
        private LiveCharts.WinForms.PieChart pieChart; // Use the WinForms PieChart

        public MainForm()
        {
            InitializeComponents();
            _firestoreService = new FirestoreService();
        }

        private void InitializeComponents()
        {
            this.Text = "Copilot Usage Tracker";
            this.Size = new System.Drawing.Size(600, 500);
            this.FormBorderStyle = FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;

            Label usernameLabel = new Label() { Text = "Select User:", Left = 20, Top = 20, Width = 100 };
            this.Controls.Add(usernameLabel);

            usernameDropdown = new ComboBox() { Left = 120, Top = 18, Width = 150 };
            usernameDropdown.Items.AddRange(new string[] { "Alice", "Jaydip" });
            this.Controls.Add(usernameDropdown);

            Label dateLabel = new Label() { Text = "Select Date:", Left = 20, Top = 60, Width = 100 };
            this.Controls.Add(dateLabel);

            datePicker = new DateTimePicker() { Left = 120, Top = 58, Width = 150, Format = DateTimePickerFormat.Short };
            this.Controls.Add(datePicker);

            fetchButton = new Button() { Text = "Fetch Data", Left = 300, Top = 40, Width = 100 };
            fetchButton.Click += (sender, e) => FetchData();
            this.Controls.Add(fetchButton);

            downloadButton = new Button() { Text = "Download Data", Left = 420, Top = 40, Width = 120 };
            downloadButton.Click += async (sender, e) => await DownloadData();
            this.Controls.Add(downloadButton);

            totalTimeLabel = new Label() { Left = 20, Top = 100, Width = 300 };
            this.Controls.Add(totalTimeLabel);

            copilotTimeLabel = new Label() { Left = 20, Top = 130, Width = 300 };
            this.Controls.Add(copilotTimeLabel);

            // Use Panel for positioning instead of setting Left, Top manually
            Panel chartPanel = new Panel()
            {
                Left = 20,
                Top = 170,
                Width = 500,
                Height = 250
            };

            // Initialize the WinForms PieChart
            pieChart = new LiveCharts.WinForms.PieChart()
            {
                Dock = DockStyle.Fill // Fill the panel instead of using Left, Top
            };

            chartPanel.Controls.Add(pieChart);
            this.Controls.Add(chartPanel);
        }

        private void FetchData()
        {
            if (usernameDropdown.SelectedItem == null)
            {
                MessageBox.Show("Please select a user.");
                return;
            }

            string username = usernameDropdown.SelectedItem.ToString();
            string selectedDate = datePicker.Value.ToString("dd-MM-yyyy");

            var usageData = _firestoreService.GetUsageDataFromJson(username, selectedDate);

            totalTimeLabel.Text = $"Total VS Code Time: {usageData.TotalUsageTime}";
            copilotTimeLabel.Text = $"Copilot Time: {usageData.CopilotUsageTime}";

            UpdatePieChart(usageData.TotalUsageTime, usageData.CopilotUsageTime);
        }

        private async Task DownloadData()
        {
            await _firestoreService.DownloadAllData();
            MessageBox.Show("Data downloaded successfully!");
        }

        private void UpdatePieChart(string totalTime, string copilotTime)
        {
            TimeSpan total = TimeSpan.Parse(totalTime);
            TimeSpan copilot = TimeSpan.Parse(copilotTime);
            TimeSpan remaining = total - copilot;

            pieChart.Series.Clear();
            pieChart.Series = new LiveCharts.SeriesCollection
            {
                new PieSeries
                {
                    Title = "Copilot",
                    Values = new LiveCharts.ChartValues<double> { copilot.TotalSeconds },
                    DataLabels = true
                },
                new PieSeries
                {
                    Title = "Other VS Code Usage",
                    Values = new LiveCharts.ChartValues<double> { remaining.TotalSeconds },
                    DataLabels = true
                }
            };
        }
    }
}
