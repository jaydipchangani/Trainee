

namespace AIUsageMonitor
{
    partial class Form1 :Form
    {
        private System.Windows.Forms.Label lblDate;
        private System.Windows.Forms.Label lblTotalTime;
        private System.Windows.Forms.Label lblAITime;
        private System.Windows.Forms.Label lblTabsOpened;
        private System.Windows.Forms.Label lblTabsClosed;
        private System.Windows.Forms.Label lblLastUsed;
        private System.Windows.Forms.ListBox lstAIUsage;
        private System.Windows.Forms.Button btnLoadData;

        private void InitializeComponent()

        {

            this.chartAIUsage = new System.Windows.Forms.DataVisualization.Charting.Chart();
            ((System.ComponentModel.ISupportInitialize)(this.chartAIUsage)).BeginInit();

            // Configure Chart Properties
            this.chartAIUsage.Location = new System.Drawing.Point(300, 20);
            this.chartAIUsage.Size = new System.Drawing.Size(400, 300);
            this.chartAIUsage.ChartAreas.Add(new System.Windows.Forms.DataVisualization.Charting.ChartArea("ChartArea1"));

            // Configure Series
            var series = new System.Windows.Forms.DataVisualization.Charting.Series("AI Usage")
            {
                ChartType = System.Windows.Forms.DataVisualization.Charting.SeriesChartType.Pie
            };
            this.chartAIUsage.Series.Add(series);

            // Add to Form
            this.Controls.Add(this.chartAIUsage);

            ((System.ComponentModel.ISupportInitialize)(this.chartAIUsage)).EndInit();


            lblDate = new Label();
            lblTotalTime = new Label();
            lblAITime = new Label();
            lblTabsOpened = new Label();
            lblTabsClosed = new Label();
            lblLastUsed = new Label();
            lstAIUsage = new ListBox();
            btnLoadData = new Button();
            cmbSelectDate = new ComboBox();
            SuspendLayout();
            // 
            // lblDate
            // 
            lblDate.Location = new Point(10, 10);
            lblDate.Name = "lblDate";
            lblDate.Size = new Size(100, 23);
            lblDate.TabIndex = 0;
            // 
            // lblTotalTime
            // 
            lblTotalTime.Location = new Point(10, 40);
            lblTotalTime.Name = "lblTotalTime";
            lblTotalTime.Size = new Size(100, 23);
            lblTotalTime.TabIndex = 1;
            // 
            // lblAITime
            // 
            lblAITime.Location = new Point(10, 70);
            lblAITime.Name = "lblAITime";
            lblAITime.Size = new Size(100, 23);
            lblAITime.TabIndex = 2;
            // 
            // lblTabsOpened
            // 
            lblTabsOpened.Location = new Point(10, 100);
            lblTabsOpened.Name = "lblTabsOpened";
            lblTabsOpened.Size = new Size(100, 23);
            lblTabsOpened.TabIndex = 3;
            // 
            // lblTabsClosed
            // 
            lblTabsClosed.Location = new Point(10, 130);
            lblTabsClosed.Name = "lblTabsClosed";
            lblTabsClosed.Size = new Size(100, 23);
            lblTabsClosed.TabIndex = 4;
            // 
            // lblLastUsed
            // 
            lblLastUsed.Location = new Point(10, 160);
            lblLastUsed.Name = "lblLastUsed";
            lblLastUsed.Size = new Size(100, 23);
            lblLastUsed.TabIndex = 5;
            // 
            // lstAIUsage
            // 
            lstAIUsage.ItemHeight = 15;
            lstAIUsage.Location = new Point(10, 200);
            lstAIUsage.Name = "lstAIUsage";
            lstAIUsage.Size = new Size(260, 139);
            lstAIUsage.TabIndex = 6;
            // 
            // btnLoadData
            // 
            btnLoadData.Location = new Point(10, 370);
            btnLoadData.Name = "btnLoadData";
            btnLoadData.Size = new Size(120, 30);
            btnLoadData.TabIndex = 7;
            btnLoadData.Text = "Load JSON Data";
            btnLoadData.Click += btnLoadData_Click;
            // 
            // cmbSelectDate
            // 
            cmbSelectDate.FormattingEnabled = true;
            cmbSelectDate.Location = new Point(167, 25);
            cmbSelectDate.Name = "cmbSelectDate";
            cmbSelectDate.Size = new Size(121, 23);
            cmbSelectDate.TabIndex = 8;
            cmbSelectDate.Text = "cmbSelectDate";
            // 
            // Form1
            // 
            ClientSize = new Size(300, 420);
            Controls.Add(cmbSelectDate);
            Controls.Add(lblDate);
            Controls.Add(lblTotalTime);
            Controls.Add(lblAITime);
            Controls.Add(lblTabsOpened);
            Controls.Add(lblTabsClosed);
            Controls.Add(lblLastUsed);
            Controls.Add(lstAIUsage);
            Controls.Add(btnLoadData);
            Name = "Form1";
            Text = "AI Usage Monitor";
            ResumeLayout(false);
        }
        private ComboBox cmbSelectDate;
    }
}
