using Microsoft.AspNetCore.Mvc;

namespace ProyectoLenguajes_ProfessorMVC.Models
{
    public class CommentNews
    {
        private int idComment;
        private int idUser;
        private int idNew;
        private string contentC;

        public CommentNews(int idComment, int idUser, int idNew, string contentC)
        {
            this.idComment = idComment;
            this.idUser = idUser;
            this.idNew = idNew;
            this.contentC = contentC;
        }

        public int IdComment { get => idComment; set => idComment = value; }
        public int IdUser { get => idUser; set => idUser = value; }
        public int IdNew { get => idNew; set => idNew = value; }
        public string ContentC { get => contentC; set => contentC = value; }        

    }
}
