using System;

namespace TaskFive.Services
{
    public class TransientGuidService : IGuidService
    {
        private readonly string _guid;

        public TransientGuidService()
        {
            _guid = Guid.NewGuid().ToString();
        }

        public string GetGuid()
        {
            return _guid;
        }
    }
}
