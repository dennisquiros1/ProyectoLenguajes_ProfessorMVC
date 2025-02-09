namespace ProyectoLenguajes_ProfessorMVC.Models
{
    public class Student
    {

        private string id;

        private string name;

        private string lastName;

        private string password;

        private string email;

        private string likings;

        private string? photo;

        private short active;

        private short register;

        private short asociation;

        public Student()
        {
        }

        public Student(string id, string name, string lastName, string password, string email, string likings, string? photo, short active, short register, short asociation)
        {
            Id = id;
            Name = name;
            LastName = lastName;
            Password = password;
            Email = email;
            Likings = likings;
            Photo = photo;
            Active = active;
            Register = register;
            Asociation = asociation;
        }

        public string Id { get => id; set => id = value; }
        public string Name { get => name; set => name = value; }
        public string LastName { get => lastName; set => lastName = value; }
        public string Password { get => password; set => password = value; }
        public string Email { get => email; set => email = value; }
        public string Likings { get => likings; set => likings = value; }
        public string? Photo { get => photo; set => photo = value; }
        public short Active { get => active; set => active = value; }
        public short Register { get => register; set => register = value; }
        public short Asociation { get => asociation; set => asociation = value; }
    }
}
