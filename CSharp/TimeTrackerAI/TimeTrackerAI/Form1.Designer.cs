namespace AIUsageMonitor
{
    partial class Form1 :Form
    {
        private System.Windows.Forms.ListBox lstAIUsage;
        private System.Windows.Forms.Label lblTotalTime;
        private System.Windows.Forms.Label lblAITime;
        private System.Windows.Forms.Label lblTabsOpened;
        private System.Windows.Forms.Label lblTabsClosed;
        private System.Windows.Forms.Label lblLastUsed;

        private void InitializeComponent()
        {
            this.lstAIUsage = new System.Windows.Forms.ListBox();
            this.lblTotalTime = new System.Windows.Forms.Label();
            this.lblAITime = new System.Windows.Forms.Label();
            this.lblTabsOpened = new System.Windows.Forms.Label();
            this.lblTabsClosed = new System.Windows.Forms.Label();
            this.lblLastUsed = new System.Windows.Forms.Label();
            this.SuspendLayout();

            // ListBox lstAIUsage
            this.lstAIUsage.Location = new System.Drawing.Point(10, 200);
            this.lstAIUsage.Size = new System.Drawing.Size(260, 150);

            // Labels
            this.lblTotalTime.Location = new System.Drawing.Point(10, 10);
            this.lblAITime.Location = new System.Drawing.Point(10, 40);
            this.lblTabsOpened.Location = new System.Drawing.Point(10, 70);
            this.lblTabsClosed.Location = new System.Drawing.Point(10, 100);
            this.lblLastUsed.Location = new System.Drawing.Point(10, 130);

            // Add controls to form
            this.Controls.Add(this.lstAIUsage);
            this.Controls.Add(this.lblTotalTime);
            this.Controls.Add(this.lblAITime);
            this.Controls.Add(this.lblTabsOpened);
            this.Controls.Add(this.lblTabsClosed);
            this.Controls.Add(this.lblLastUsed);

            this.ClientSize = new System.Drawing.Size(300, 400);
            this.Text = "AI Usage Monitor";

            this.ResumeLayout(false);
        }


    }
}
