namespace ProyectoLenguajes_ProfessorMVC.Models
{
    public class Course
    {
        private string acronym;

        private string name;

        private string description;

        private int? cycle;

        private int? semester;

        private int? quota;

        private string? idProfessor;

        public Course()
        {
        }

        public Course(string acronym, string name, string description, int? cycle, int? semester, int? quota, string? idProfessor)
        {
            Acronym = acronym;
            Name = name;
            Description = description;
            Cycle = cycle;
            Semester = semester;
            Quota = quota;
            IdProfessor = idProfessor;
        }


        public string Acronym { get => acronym; set => acronym = value; }
        public string Name { get => name; set => name = value; }
        public string Description { get => description; set => description = value; }
        public int? Cycle { get => cycle; set => cycle = value; }
        public int? Semester { get => semester; set => semester = value; }
        public int? Quota { get => quota; set => quota = value; }
        public string? IdProfessor { get => idProfessor; set => idProfessor = value; }
    }
}
