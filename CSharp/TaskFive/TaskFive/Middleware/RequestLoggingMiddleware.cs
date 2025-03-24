using System.Diagnostics;

namespace TaskFive.Middleware
{
    public class RequestLoggingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<RequestLoggingMiddleware> _logger;

        public RequestLoggingMiddleware(RequestDelegate next, ILogger<RequestLoggingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var stopwatch = Stopwatch.StartNew();

            // Log request details
            _logger.LogInformation($"Incoming Request: {context.Request.Method} {context.Request.Path}");

            await _next(context); // Call the next middleware

            stopwatch.Stop();
            _logger.LogInformation($"Response Status: {context.Response.StatusCode} | Time Taken: {stopwatch.ElapsedMilliseconds} ms");
        }
    }
}
