<<<<<<< HEAD
using QuickBookAPI.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHttpClient();
builder.Services.AddScoped<IAccountService, AccountService>();
=======
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using QuickBookAPI.Data;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddSingleton<IMongoService, MongoService>(); 
builder.Services.AddDbContext<QuickBooksDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

>>>>>>> a550f6f07e6f8c4b7a08ef3313751014e4646361

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // Allow only your frontend
              .AllowAnyMethod()  // Allow GET, POST, etc.
              .AllowAnyHeader()  // Allow all headers
              .AllowCredentials(); // Allow cookies & authentication headers
    });
});
// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
// Enable CORS before using controllers
app.UseCors("AllowReactApp");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
