namespace ProyectoLenguajes_ProfessorMVC.Models
{
    public class ApplicationConsultation
    {
        private int id;
        private string text;
        private short status;
        private string answer;
        private string idStudent;
        private string idProfessor;
        private DateOnly date;
        public ApplicationConsultation()
        {
        }

        public ApplicationConsultation(int id, string text, short status, string answer, string idStudent, string idProfessor, DateOnly date)
        {
            Id = id;
            Text = text;
            Status = status;
            Answer = answer;
            IdStudent = idStudent;
            IdProfessor = idProfessor;
            Date = date;
            
        }

        public string Text { get => text; set => text = value; }
        public string IdStudent { get => idStudent; set => idStudent = value; }
        public string IdProfessor { get => idProfessor; set => idProfessor = value; }
        public DateOnly Date { get => date; set => date = value;}
        public int Id { get => id; set => id = value; }
        public short Status { get => status; set => status = value; }
        public string Answer { get => answer; set => answer = value; }
    }
}
