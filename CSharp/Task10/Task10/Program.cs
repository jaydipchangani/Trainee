using Microsoft.OpenApi.Models;
using Microsoft.Extensions.Options;
using Task10.Models;
using MongoDB.Driver;
using Task10.Services; // Required for MongoDB settings

var builder = WebApplication.CreateBuilder(args);

// Bind MongoDbSettings from appsettings.json
builder.Services.Configure<MongoDbSettings>(builder.Configuration.GetSection("MongoDbSettings"));

// Register MongoDB client as a Singleton
builder.Services.AddSingleton<IMongoClient>(serviceProvider =>
{
    // Get the MongoDbSettings from DI container
    var mongoDbSettings = serviceProvider.GetRequiredService<IOptions<MongoDbSettings>>().Value;

    // Use the connection string from settings to create a MongoClient
    return new MongoClient(mongoDbSettings.ConnectionString);
});

builder.Services.Configure<MongoDbSettings>(builder.Configuration.GetSection("MongoDbSettings"));
builder.Services.Configure<CsvSettings>(builder.Configuration.GetSection("CsvSettings"));
builder.Services.AddSingleton<MongoDbService>();


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "File Upload API", Version = "v1" });
});

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "File Upload API v1"));
}

app.UseAuthorization();
app.MapControllers();
app.Run();
