using TaskFive.Services;using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddTransient<TransientGuidService>(); // Transient
builder.Services.AddScoped<ScopedGuidService>();       // Scoped
builder.Services.AddSingleton<SingletonGuidService>(); // Singleton



// Add services to the container.
builder.Services.AddControllersWithViews();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseMiddleware<TaskFive.Middleware.RequestLoggingMiddleware>();


app.UseMiddleware<TaskFive.Middleware.ExceptionHandlingMiddleware>();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
