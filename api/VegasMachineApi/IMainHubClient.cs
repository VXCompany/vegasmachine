namespace VegasMachineApi;

public interface IMainHubClient
{
    Task ReceiveMessage(string message);
}