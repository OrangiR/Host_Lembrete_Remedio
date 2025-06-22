
document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('mini-calendar');
  if (!el) return;

  const lembretes = JSON.parse(localStorage.getItem('lembretes')) || [];

  const eventos = lembretes.map(l => ({
    title: l.nome,
    start: l.dataCalendario || '2025-01-01'
  }));

  $('#mini-calendar').fullCalendar({
    locale: 'pt-br',
    header: false,
    height: 'auto',
    events: eventos,
    fixedWeekCount: false,
    eventColor: '#c62828',
    eventTextColor: '#fff',
    dayClick(date) {
      const dia = moment(date).format('DD/MM/YYYY');
      const doDia = eventos.filter(e => moment(e.start).isSame(date, 'day'));
      if (doDia.length) {
        alert(`Lembretes em ${dia}:\n` + doDia.map(e => e.title).join('\n'));
      }
    }
  });
});