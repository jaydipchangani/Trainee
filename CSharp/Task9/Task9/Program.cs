using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MongoDB.Driver;
using System.Text;
using Task9.Middlewares;
using Task9.Services;

var builder = WebApplication.CreateBuilder(args);

// Add MongoDB Identity with explicit RoleManager configuration
builder.Services
    .AddIdentityCore<ApplicationUser>(options =>
    {
        // Configure identity options if needed
    })
    .AddRoles<ApplicationRole>()
    .AddMongoDbStores<ApplicationUser, ApplicationRole, Guid>(
        builder.Configuration["MongoDB:ConnectionString"],
        builder.Configuration["MongoDB:DatabaseName"])
    .AddDefaultTokenProviders()
    .AddSignInManager();

// Ensure explicit RoleManager registration
builder.Services.AddScoped<RoleManager<ApplicationRole>>();

// Register IMongoCollection<ApplicationUser>
builder.Services.AddSingleton<IMongoClient>(sp =>
{
    var settings = MongoClientSettings.FromConnectionString(builder.Configuration["MongoDB:ConnectionString"]);
    return new MongoClient(settings);
});

builder.Services.AddScoped(sp =>
{
    var client = sp.GetRequiredService<IMongoClient>();
    var database = client.GetDatabase(builder.Configuration["MongoDB:DatabaseName"]);
    return database.GetCollection<ApplicationUser>("Users");
});

// Rest of your existing configuration remains the same...
var jwtKey = builder.Configuration["Jwt:Key"];
if (string.IsNullOrEmpty(jwtKey) || Encoding.UTF8.GetBytes(jwtKey).Length < 32)
{
    throw new Exception("JWT Key must be at least 32 characters long.");
}

var key = Encoding.UTF8.GetBytes(jwtKey);
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddSingleton<TokenServices>();
builder.Services.AddScoped<UserManager<ApplicationUser>>();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Add Swagger with JWT Authentication
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Task9 API",
        Version = "v1",
        Description = "Authentication and Authorization Demo API"
    });

    // JWT Bearer Authentication configuration for Swagger
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter your JWT token in the format: Bearer {your_token}"
    });

    // Add security requirement
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

var app = builder.Build();

// Role seeding
using (var scope = app.Services.CreateScope())
{
    var serviceProvider = scope.ServiceProvider;
    var roleManager = serviceProvider.GetRequiredService<RoleManager<ApplicationRole>>();
    string[] roleNames = { "Admin", "Manager", "User" };
    foreach (var role in roleNames)
    {
        var roleExists = await roleManager.RoleExistsAsync(role);
        if (!roleExists)
        {
            await roleManager.CreateAsync(new ApplicationRole { Name = role });
        }
    }
}

// Configure Swagger UI
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Task9 API V1");

    // Optional: Customize Swagger UI
    c.DocumentTitle = "Task9 API Documentation";
    c.DisplayOperationId();
    c.DisplayRequestDuration();
});

app.UseMiddleware<TokenValidationMiddleware>();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
