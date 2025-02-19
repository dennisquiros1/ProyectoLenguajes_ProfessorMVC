namespace ProyectoLenguajes_ProfessorMVC.Models
{
    public class CommentCourse
    {

        private int idCommentC;

        private string contentC;

        private string acronym;

        private DateOnly date;

        private string idUser;



        public CommentCourse()
        {
        }

        public CommentCourse(int idCommentC, string acronym, DateOnly date, string idUser, string contentC)
        {
            IdCommentC = idCommentC;
            Acronym = acronym;
            Date = date;
            IdUser = idUser;
            ContentC = contentC;
        }

        public int IdCommentC { get => idCommentC; set => idCommentC = value; }
        public string Acronym { get => acronym; set => acronym = value; }
        public string IdUser { get => idUser; set => idUser = value; }
        public string ContentC { get => contentC; set => contentC = value; }
        public DateOnly Date { get => date; set => date = value; }
    }
}
