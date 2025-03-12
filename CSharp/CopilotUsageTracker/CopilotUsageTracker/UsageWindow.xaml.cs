using System.IO;
using System.Windows;

namespace CopilotUsageTracker
{
    public partial class UsageWindow : Window
    {
        private string logFilePath = Path.Combine(System.Environment.GetFolderPath(System.Environment.SpecialFolder.ApplicationData), "CopilotUsageLog.txt");

        public UsageWindow()
        {
            InitializeComponent();
            LoadUsage();
        }

        private void LoadUsage()
        {
            if (File.Exists(logFilePath))
            {
                string usageData = File.ReadAllText(logFilePath);
                UsageText.Text = usageData;
            }
            else
            {
                UsageText.Text = "No usage data available.";
            }
        }

        private void RefreshUsage(object sender, RoutedEventArgs e)
        {
            LoadUsage();
        }
    }
}
