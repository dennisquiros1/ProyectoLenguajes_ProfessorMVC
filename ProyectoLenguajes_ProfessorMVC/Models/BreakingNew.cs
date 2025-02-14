namespace ProyectoLenguajes_ProfessorMVC.Models
{
        public class BreakingNew
        {

            private int idNew;
            private string title;
            private string paragraph;
            private string? photo;
            private DateOnly date;

            public BreakingNew(int idNew, string title, string paragraph, string? photo, DateOnly date)
            {
                this.idNew = idNew;
                this.title = title;
                this.paragraph = paragraph;
                this.photo = photo;
                this.date = date;
            }

            public int IdNew { get => idNew; set => idNew = value; }
            public string Title { get => title; set => title = value; }
            public string Paragraph { get => paragraph; set => paragraph = value; }
            public string? Photo { get => photo; set => photo = value; }
            public DateOnly Date { get => date; set => date = value; }
        }
}
