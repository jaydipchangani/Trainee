using System;

namespace CopilotUsageTracker
{
    static class GuidList
    {
        public const string guidCopilotUsageTrackerPkgString = "12345678-abcd-1234-efgh-56789abcdef0"; // Unique GUID
        public const string guidCopilotUsageTrackerCmdSetString = "abcdef12-3456-789a-bcde-f0123456789a"; // Unique GUID

        public static readonly Guid guidCopilotUsageTrackerCmdSet = new Guid(guidCopilotUsageTrackerCmdSetString);
    };
}
