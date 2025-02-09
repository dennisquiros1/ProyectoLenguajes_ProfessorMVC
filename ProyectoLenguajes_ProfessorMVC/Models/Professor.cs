namespace ProyectoLenguajes_ProfessorMVC.Models
{
    public class Professor
    {

        private string id;

        private string name;

        private string lastName;

        private string password;

        private string email;

        private short active;

        private string? photo;

        private string? expertise;


        public Professor()
        {
        }

        public Professor(string id, string name, string lastName, string password, string email, short active, string? photo, string? expertise)
        {
            Id = id;
            Name = name;
            LastName = lastName;
            Password = password;
            Email = email;
            Active = active;
            Photo = photo;
            Expertise = expertise;
        }

        public string Id { get => id; set => id = value; }
        public string Name { get => name; set => name = value; }
        public string LastName { get => lastName; set => lastName = value; }
        public string Password { get => password; set => password = value; }
        public string Email { get => email; set => email = value; }
        public short Active { get => active; set => active = value; }
        public string? Photo { get => photo; set => photo = value; }
        public string? Expertise { get => expertise; set => expertise = value; }
    }
}
