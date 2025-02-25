﻿namespace ProyectoLenguajes_ProfessorMVC.Models
{
    public class PrivateConsultation
    {
        private int id;
        private string text;
        private short status;
        private string answer;
        private DateOnly date;
        private string idStudent;
        private string idProfessor;

        public PrivateConsultation(){}

        public PrivateConsultation(int id, string text, short status, string answer, DateOnly date, string idStudent, string idProfessor)
        {
            Id = id;
            Text = text;
            Status = status;
            Answer = answer;
            Date = date;
            IdStudent = idStudent;
            IdProfessor = idProfessor;
        }

        public int Id { get => id; set => id = value; }
        public string Text { get => text; set => text = value; }
        public short Status { get => status; set => status = value; }
        public string Answer { get => answer; set => answer = value; }
        public DateOnly Date { get => date; set => date = value; }
        public string IdStudent { get => idStudent; set => idStudent = value; }
        public string IdProfessor { get => idProfessor; set => idProfessor = value; }
    }
}
