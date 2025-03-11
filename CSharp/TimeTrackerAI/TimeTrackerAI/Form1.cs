using System;
using System.IO;
using System.Net;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace AIUsageMonitor
{
    public partial class Form1 : Form
    {
        private HttpListener listener;

        public Form1()
        {
            InitializeComponent();
            StartServer();
        }

        private async void StartServer()
        {
            listener = new HttpListener();
            listener.Prefixes.Add("http://localhost:5000/update-data/");
            listener.Start();

            await Task.Run(() =>
            {
                while (true)
                {
                    HttpListenerContext context = listener.GetContext();
                    ProcessRequest(context);
                }
            });
        }

        private async void ProcessRequest(HttpListenerContext context)
        {
            try
            {
                using (StreamReader reader = new StreamReader(context.Request.InputStream, context.Request.ContentEncoding))
                {
                    string requestData = await reader.ReadToEndAsync();
                    var data = JsonSerializer.Deserialize<AIUsageData>(requestData, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                    // Update UI
                    Invoke(new Action(() => UpdateUI(data)));
                }

                context.Response.StatusCode = 200;
                context.Response.Close();
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error processing request: " + ex.Message);
            }
        }

        private void UpdateUI(AIUsageData data)
        {
            lblDate.Text = "Date: " + data.Date;
            lblTotalTime.Text = "Total Time: " + FormatTime(data.Data.TotalTime);
            lblAITime.Text = "AI Time: " + FormatTime(data.Data.AITime);
            lblTabsOpened.Text = "Tabs Opened: " + data.Data.TabsOpened;
            lblTabsClosed.Text = "Tabs Closed: " + data.Data.TabsClosed;
            lblLastUsed.Text = "Last AI Used: " + data.Data.LastAIUsed.Website + " at " + data.Data.LastAIUsed.Timestamp;

            lstAIUsage.Items.Clear();
            foreach (var usage in data.Data.AIUsage)
            {
                lstAIUsage.Items.Add($"{usage.Key}: {FormatTime(usage.Value)}");
            }
        }

        private string FormatTime(long milliseconds)
        {
            TimeSpan time = TimeSpan.FromMilliseconds(milliseconds);
            return $"{time.Hours}h {time.Minutes}m {time.Seconds}s";
        }

        private void InitializeComponent()
        {
            lblTotalTime = new Label();
            lblDate = new Label();
            lblTabsOpened = new Label();
            lblAITime = new Label();
            lblLastUsed = new Label();
            lblTabsClosed = new Label();
            lstAIUsage = new ListBox();
            SuspendLayout();
            // 
            // lblTotalTime
            // 
            lblTotalTime.AutoSize = true;
            lblTotalTime.Location = new Point(10, 40);
            lblTotalTime.Name = "lblTotalTime";
            lblTotalTime.Size = new Size(71, 15);
            lblTotalTime.TabIndex = 0;
            lblTotalTime.Text = "lblTotalTime";
            lblTotalTime.Click += lblTotalTime_Click;
            // 
            // lblDate
            // 
            lblDate.AutoSize = true;
            lblDate.Location = new Point(10, 10);
            lblDate.Name = "lblDate";
            lblDate.Size = new Size(44, 15);
            lblDate.TabIndex = 1;
            lblDate.Text = "lblDate";
            lblDate.Click += label1_Click;
            // 
            // lblTabsOpened
            // 
            lblTabsOpened.AutoSize = true;
            lblTabsOpened.Location = new Point(10, 100);
            lblTabsOpened.Name = "lblTabsOpened";
            lblTabsOpened.Size = new Size(85, 15);
            lblTabsOpened.TabIndex = 3;
            lblTabsOpened.Text = "lblTabsOpened";
            lblTabsOpened.Click += label1_Click_1;
            // 
            // lblAITime
            // 
            lblAITime.AutoSize = true;
            lblAITime.BackColor = SystemColors.Control;
            lblAITime.Location = new Point(10, 70);
            lblAITime.Name = "lblAITime";
            lblAITime.Size = new Size(57, 15);
            lblAITime.TabIndex = 2;
            lblAITime.Text = "lblAITime";
            // 
            // lblLastUsed
            // 
            lblLastUsed.AutoSize = true;
            lblLastUsed.Location = new Point(10, 160);
            lblLastUsed.Name = "lblLastUsed";
            lblLastUsed.Size = new Size(67, 15);
            lblLastUsed.TabIndex = 5;
            lblLastUsed.Text = "lblLastUsed";
            // 
            // lblTabsClosed
            // 
            lblTabsClosed.AutoSize = true;
            lblTabsClosed.BackColor = SystemColors.Control;
            lblTabsClosed.Location = new Point(10, 130);
            lblTabsClosed.Name = "lblTabsClosed";
            lblTabsClosed.Size = new Size(79, 15);
            lblTabsClosed.TabIndex = 4;
            lblTabsClosed.Text = "lblTabsClosed";
            // 
            // lstAIUsage
            // 
            lstAIUsage.FormattingEnabled = true;
            lstAIUsage.ItemHeight = 15;
            lstAIUsage.Location = new Point(10, 200);
            lstAIUsage.Name = "lstAIUsage";
            lstAIUsage.Size = new Size(260, 139);
            lstAIUsage.TabIndex = 6;
            // 
            // Form1
            // 
            ClientSize = new Size(695, 409);
            Controls.Add(lstAIUsage);
            Controls.Add(lblLastUsed);
            Controls.Add(lblTabsClosed);
            Controls.Add(lblTabsOpened);
            Controls.Add(lblAITime);
            Controls.Add(lblDate);
            Controls.Add(lblTotalTime);
            FormBorderStyle = FormBorderStyle.FixedDialog;
            Name = "Form1";
            StartPosition = FormStartPosition.CenterScreen;
            Text = "AI Usage Monitor";
            Load += Form1_Load;
            ResumeLayout(false);
            PerformLayout();

        }

        private void Form1_Load(object sender, EventArgs e)
        {

        }
        private Label lblTotalTime;
        private Label lblDate;

        private void label1_Click(object sender, EventArgs e)
        {

        }

        private void lblTotalTime_Click(object sender, EventArgs e)
        {

        }
        private Label lblTabsOpened;
        private Label lblAITime;

        private void label1_Click_1(object sender, EventArgs e)
        {

        }
        private Label lblLastUsed;
        private Label lblTabsClosed;
        private ListBox lstAIUsage;
    }

    public class AIUsageData
    {
        public string Date { get; set; }
        public AIData Data { get; set; }
    }

    public class AIData
    {
        public long TotalTime { get; set; }
        public long AITime { get; set; }
        public int TabsOpened { get; set; }
        public int TabsClosed { get; set; }
        public Dictionary<string, long> AIUsage { get; set; }
        public LastAIUsed LastAIUsed { get; set; }
    }

    public class LastAIUsed
    {
        public long Timestamp { get; set; }
        public string Website { get; set; }
    }
}
