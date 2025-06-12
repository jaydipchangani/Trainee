namespace TaskFive.Services
{
    public class SingletonGuidService 
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
