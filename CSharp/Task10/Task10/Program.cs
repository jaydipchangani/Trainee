using Microsoft.OpenApi.Models;
using Microsoft.Extensions.Options;
using Task10.Models;
using Task10.Services; // Required for MongoDB settings

var builder = WebApplication.CreateBuilder(args);


builder.Services.Configure<MongoDbSettings>(builder.Configuration.GetSection("MongoDbSettings"));
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
