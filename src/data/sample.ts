// Dati di esempio per l'interfaccia (M1). In M2 saranno sostituiti dai metadati reali (TMDB).

export type Kind = 'film' | 'serie'

export interface SampleItem {
  id: number
  title: string
  year: number
  kind: Kind
  hue: number
  overview: string
  progress?: number
}

export const sampleItems: SampleItem[] = [
  { id: 1, title: 'Notte Blu', year: 2024, kind: 'film', hue: 222, progress: 62, overview: 'Un pilota di traghetti scopre che il fiume che attraversa ogni notte non compare su nessuna mappa.' },
  { id: 2, title: 'Le Ore Vuote', year: 2023, kind: 'serie', hue: 340, progress: 25, overview: 'Una squadra di restauratori trova un diario nascosto sotto un affresco del Seicento.' },
  { id: 3, title: 'Cenere e Sale', year: 2022, kind: 'film', hue: 18, progress: 80, overview: 'Due fratelli ereditano una salina abbandonata e un segreto di famiglia.' },
  { id: 4, title: 'Orbita Bassa', year: 2025, kind: 'serie', hue: 190, overview: 'Il quotidiano di una stazione spaziale commerciale a un passo dal fallimento.' },
  { id: 5, title: 'Il Cartografo', year: 2021, kind: 'film', hue: 48, overview: 'Un cartografo cieco ridisegna una città dalla memoria dei suoi abitanti.' },
  { id: 6, title: 'Vento di Mezzo', year: 2024, kind: 'serie', hue: 140, overview: 'Quattro stagioni in un villaggio di montagna isolato dalla neve.' },
  { id: 7, title: 'Ultima Corsa', year: 2020, kind: 'film', hue: 8, overview: 'Un tassista e una passeggera attraversano la città in una notte senza fine.' },
  { id: 8, title: 'Mare Dentro', year: 2023, kind: 'film', hue: 205, overview: 'Una biologa marina insegue un segnale che nessuno oltre a lei riesce a sentire.' },
  { id: 9, title: 'Casa Vetro', year: 2022, kind: 'serie', hue: 275, overview: 'Un thriller domestico in un edificio dove ogni parete è trasparente.' },
  { id: 10, title: 'Ombre Corte', year: 2025, kind: 'film', hue: 330, overview: 'Un fotografo scopre che le sue immagini anticipano ciò che accadrà.' },
  { id: 11, title: 'Radio Notturna', year: 2021, kind: 'serie', hue: 30, overview: 'Una voce anonima in onda dopo mezzanotte cambia la vita di chi ascolta.' },
  { id: 12, title: 'Terra Rossa', year: 2024, kind: 'film', hue: 12, overview: 'Un agronomo prova a far rinascere un campo che la siccità ha reso sterile.' },
]
