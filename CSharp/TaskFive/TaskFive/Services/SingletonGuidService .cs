namespace TaskFive.Services
{
    public class SingletonGuidService : IGuidService
    {
        private readonly string _guid;

        public SingletonGuidService()
        {
            _guid = Guid.NewGuid().ToString();
        }

        public string GetGuid()
        {
            return _guid;
        }
    }
}
