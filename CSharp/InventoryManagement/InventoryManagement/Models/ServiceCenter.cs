public class ServiceCenter
{
    public string Id { get; set; } = Guid.NewGuid().ToString(); // Change from int to string
    public string Name { get; set; }
    public string PrimaryContactName { get; set; }
    public string PhoneNumber { get; set; }
    public string Address { get; set; }
}
