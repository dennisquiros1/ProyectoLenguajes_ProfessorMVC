using Microsoft.AspNetCore.Mvc;

namespace ProyectoLenguajes_ProfessorMVC.Models
{
    public class CommentNews
    {
        private int idComment;
        private string idUser;
        private int idNew;
        private string contentC;
        private DateOnly date;
        public CommentNews(int idComment, string idUser, int idNew, string contentC, DateOnly date)
        {
            this.idComment = idComment;
            this.idUser = idUser;
            this.idNew = idNew;
            this.contentC = contentC;
            this.date = date;   
        }

        public int IdComment { get => idComment; set => idComment = value; }
        public string IdUser { get => idUser; set => idUser = value; }
        public int IdNew { get => idNew; set => idNew = value; }
        public string ContentC { get => contentC; set => contentC = value; }

        public DateOnly Date { get => date; set => date = value; }

    }
}
