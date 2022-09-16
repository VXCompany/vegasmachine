using Microsoft.AspNetCore.SignalR;
using VegasMachineApi;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSignalR();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        builder =>
        {
            builder.SetIsOriginAllowed(origin => true)
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();

        });
});

var app = builder.Build();

app.UseHttpsRedirection();

app.UseCors();

app.MapHub<MainHub>("/vegasmachine");

app.MapPost("/button-push", async () => {
    var hub = app.Services.GetRequiredService<IHubContext<MainHub>>();
    await hub.Clients.All.SendAsync("Spin");
    return Results.Ok();
});

app.MapGet("/", () => "Hello from the Vegas Machine API!");

app.Run();
