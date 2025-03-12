using System;
using System.ComponentModel.Design;
using System.IO;
using System.Timers;
using Microsoft.VisualStudio.Shell;
using Task = System.Threading.Tasks.Task;

namespace CopilotUsageTracker
{
    [PackageRegistration(UseManagedResourcesOnly = true, AllowsBackgroundLoading = true)]
    [InstalledProductRegistration("Copilot Usage Tracker", "Tracks GitHub Copilot usage time", "1.0")]
    [ProvideAutoLoad(Microsoft.VisualStudio.Shell.Interop.UIContextGuids80.NoSolution, PackageAutoLoadFlags.BackgroundLoad)]
    public sealed class CopilotUsageTrackerPackage : AsyncPackage
    {
        private Timer usageTimer;
        private DateTime copilotStartTime;
        private double totalUsageTime = 0;
        private string logFilePath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), "CopilotUsageLog.txt");

        protected override async Task InitializeAsync(System.Threading.CancellationToken cancellationToken, IProgress<ServiceProgressData> progress)
        {
            await this.JoinableTaskFactory.SwitchToMainThreadAsync(cancellationToken);
            StartTracking();

            var menuCommandService = await GetServiceAsync(typeof(IMenuCommandService)) as OleMenuCommandService;
            var menuCommandID = new CommandID(GuidList.guidCopilotUsageTrackerCmdSet, (int)PkgCmdIDList.cmdidShowUsage);
            var menuItem = new MenuCommand((s, e) => ShowUsageWindow(), menuCommandID);
            menuCommandService?.AddCommand(menuItem);

        }

        private void StartTracking()
        {
            usageTimer = new Timer(5000); // Track every 5 seconds
            usageTimer.Elapsed += TrackUsage;
            usageTimer.Start();
        }

        private void TrackUsage(object sender, ElapsedEventArgs e)
        {
            if (IsCopilotActive())
            {
                if (copilotStartTime == DateTime.MinValue)
                    copilotStartTime = DateTime.Now;
            }
            else
            {
                if (copilotStartTime != DateTime.MinValue)
                {
                    totalUsageTime += (DateTime.Now - copilotStartTime).TotalSeconds;
                    copilotStartTime = DateTime.MinValue;
                    SaveUsageData();
                }
            }
        }

        private bool IsCopilotActive()
        {
            // Placeholder: Implement Copilot detection logic
            return false;
        }

        private void SaveUsageData()
        {
            File.WriteAllText(logFilePath, $"Copilot usage time: {totalUsageTime} seconds");
        }

        private void ShowUsageWindow()
        {
            UsageWindow window = new UsageWindow();
            window.Show();
        }


    }
}
