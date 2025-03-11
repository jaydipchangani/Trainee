namespace AIUsageMonitor
{
    partial class Form1
    {
        private System.ComponentModel.IContainer components = null;

        // Declare UI components
        private Label lblDate;
        private Label lblTotalTime;
        private Label lblAITime;
        private Label lblTabsOpened;
        private Label lblTabsClosed;
        private Label lblLastUsed;
        private ListBox lstAIUsage;

        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        private void InitializeComponent()
        {
            this.lblDate = new System.Windows.Forms.Label();
            this.lblTotalTime = new System.Windows.Forms.Label();
            this.lblAITime = new System.Windows.Forms.Label();
            this.lblTabsOpened = new System.Windows.Forms.Label();
            this.lblTabsClosed = new System.Windows.Forms.Label();
            this.lblLastUsed = new System.Windows.Forms.Label();
            this.lstAIUsage = new System.Windows.Forms.ListBox();
            this.SuspendLayout();

            // Label Positions
            this.lblDate.Location = new System.Drawing.Point(10, 10);
            this.lblDate.Size = new System.Drawing.Size(250, 20);
            this.lblDate.Text = "Date: ";

            this.lblTotalTime.Location = new System.Drawing.Point(10, 40);
            this.lblTotalTime.Size = new System.Drawing.Size(250, 20);
            this.lblTotalTime.Text = "Total Time: ";

            this.lblAITime.Location = new System.Drawing.Point(10, 70);
            this.lblAITime.Size = new System.Drawing.Size(250, 20);
            this.lblAITime.Text = "AI Time: ";

            this.lblTabsOpened.Location = new System.Drawing.Point(10, 100);
            this.lblTabsOpened.Size = new System.Drawing.Size(250, 20);
            this.lblTabsOpened.Text = "Tabs Opened: ";

            this.lblTabsClosed.Location = new System.Drawing.Point(10, 130);
            this.lblTabsClosed.Size = new System.Drawing.Size(250, 20);
            this.lblTabsClosed.Text = "Tabs Closed: ";

            this.lblLastUsed.Location = new System.Drawing.Point(10, 160);
            this.lblLastUsed.Size = new System.Drawing.Size(250, 20);
            this.lblLastUsed.Text = "Last AI Used: ";

            // AI Usage List Box
            this.lstAIUsage.Location = new System.Drawing.Point(10, 200);
            this.lstAIUsage.Size = new System.Drawing.Size(260, 150);

            // Add to Form
            this.Controls.Add(this.lblDate);
            this.Controls.Add(this.lblTotalTime);
            this.Controls.Add(this.lblAITime);
            this.Controls.Add(this.lblTabsOpened);
            this.Controls.Add(this.lblTabsClosed);
            this.Controls.Add(this.lblLastUsed);
            this.Controls.Add(this.lstAIUsage);

            // Form Settings
            this.ClientSize = new System.Drawing.Size(300, 400);
            this.Text = "AI Usage Monitor";
            this.ResumeLayout(false);
        }
    }
}
