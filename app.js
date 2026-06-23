// ===== MUSKELREGIONEN =====
// Codes für die Körpergrafik (vorne/hinten). Jede Übung bekommt ein m:[...] Array.
// 'front' = nur auf Vorderansicht sichtbar, 'back' = nur auf Rückansicht, sonst beide möglich.
const MUSCLE_INFO = {
  chest:      { label:'Brust',            view:'front' },
  shoulders:  { label:'Schultern',         view:'both'  },
  triceps:    { label:'Trizeps',           view:'back'  },
  biceps:     { label:'Bizeps',            view:'front' },
  lats:       { label:'Rücken (Lat)',      view:'back'  },
  lowerback:  { label:'unterer Rücken',    view:'back'  },
  abs:        { label:'Bauch',             view:'front' },
  obliques:   { label:'seitliche Bauchmuskeln', view:'front' },
  quads:      { label:'vordere Oberschenkel', view:'front' },
  hamstrings: { label:'hintere Oberschenkel', view:'back' },
  glutes:     { label:'Gesäß',             view:'back'  },
  calves:     { label:'Waden',             view:'back'  },
  hips:       { label:'Hüfte',             view:'front' },
  // Zusätzliche Regionen, die die neue Anatomie-Grafik unterstützt (für künftige Übungen nutzbar)
  neck:       { label:'Nacken',            view:'front' },
  traps:      { label:'Trapez',            view:'back'  },
  forearms:   { label:'Unterarme',         view:'both'  },
};

// ===== DATA =====
// Hyrox-Datum ist im UI editierbar (Tab "Verlauf" → Hyrox-Wettkampf). Gespeichert
// als 'YYYY-MM-DD' in state.hyroxDate; bis Alex es setzt, gilt dieser Platzhalter.
const DEFAULT_HYROX_DATE = '2026-12-12';
function getHyroxDate(){ return dateFromKey(state.hyroxDate || DEFAULT_HYROX_DATE); }

// Offizielle Hyrox-Wettkampf-Werte (Reihenfolge fix, dazwischen je 1000 m Laufen).
// Gewichte = Doubles/Open, Herren (Quelle: HYROX Rulebook 25/26, pace-club.com).
const HYROX_RACE = {
  division: 'Doubles (= Open-Standard, Herren) · Stationen teilt ihr euch im Team',
  run: '8 × 1000 m Laufen zwischen den Stationen',
  stations: [
    { n:'SkiErg',             d:'1000 m',  w:'–' },
    { n:'Sled Push',          d:'50 m',    w:'152 kg' },
    { n:'Sled Pull',          d:'50 m',    w:'103 kg' },
    { n:'Burpee Broad Jumps', d:'80 m',    w:'Körpergewicht' },
    { n:'Rowing',             d:'1000 m',  w:'–' },
    { n:'Farmers Carry',      d:'200 m',   w:'2 × 24 kg' },
    { n:'Sandbag Lunges',     d:'100 m',   w:'20 kg' },
    { n:'Wall Balls',         d:'100 Wdh', w:'6 kg · 3 m Ziel' },
  ]
};

const WEEKDAYS = ['So','Mo','Di','Mi','Do','Fr','Sa'];
const WEEKDAYS_FULL = ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'];

// 0=So 1=Mo 2=Di 3=Mi 4=Do 5=Fr 6=Sa
// ===== PHASE 1: GRUNDAUFBAU (base) =====
// Kraft & Grundlagenausdauer. Maschinen-/Muskelaufbau-lastig, zwei lockere Läufe.
const TRAINING_PLAN_BASE = {
  1: { // Montag
    type:'choice', dot:'rust', label:'Training wählen',
    variants:{
      zirkel:{
        type:'zirkel', label:'Zirkeltraining',
        title:'Zirkeltraining · Physio Loft',
        sub:'Bootcamp-Style bei deinem Kumpel · Kraft + Ausdauer kombiniert',
        pills:['Kraft','Ausdauer','~45-60 Min'],
        exercises:[
          {n:'Anfahrt einplanen (Stau-Puffer)', s:''},
          {n:'Vor dem Training kleine Mahlzeit', s:'90 Min vorher'},
          {n:'Wasserflasche mitnehmen', s:''},
          {n:'Zirkel durchziehen', s:'volle Runde'},
          {n:'Nach Training: Protein-Mahlzeit', s:'binnen 1-2h'},
        ]
      },
      gym:{
        type:'egym', label:'egym Training',
        title:'Oberkörper Push',
        sub:'Eragym Bramsche/Recke oder Matrix Spelle · Brust, Schulter, Trizeps',
        pills:['Push','Muskelaufbau','Technogym'],
        exercises:[
          {n:'Brustpresse (Chest Press)', s:'4×10-12', m:['chest','shoulders','triceps']},
          {n:'Butterfly (Pec-Deck Maschine)', s:'3×12', m:['chest']},
          {n:'Schulterdrücken (Shoulder Press)', s:'3×12', m:['shoulders','triceps']},
          {n:'Seitheben-Maschine (Lateral Raise)', s:'3×15', m:['shoulders']},
          {n:'Trizeps-Drückmaschine (Triceps Press)', s:'3×12', m:['triceps']},
          {n:'— Core-Block —', s:''},
          {n:'Bauch-Crunchmaschine (Abdominal Crunch)', s:'3×15', m:['abs']},
          {n:'Plank (Unterarmstütz)', s:'3×40-60 Sek', m:['abs','lowerback']},
        ]
      }
    }
  },
  2: { // Dienstag
    type:'egym', dot:'steel', label:'egym Training',
    title:'Unterkörper + Core-Fokus',
    sub:'Eragym Bramsche/Recke oder Matrix Spelle · Muskelaufbau Beine + gezielter Bauchblock',
    pills:['Beine','Core','Muskelaufbau'],
    exercises:[
      {n:'Beinpresse (Leg Press)', s:'4×10-12', m:['quads','glutes','hamstrings']},
      {n:'Beinstrecker (Leg Extension)', s:'3×12', m:['quads']},
      {n:'Beinbeuger (Leg Curl)', s:'3×12', m:['hamstrings']},
      {n:'Hip Abductor (Abduktoren-Maschine)', s:'3×15', m:['glutes','hips']},
      {n:'Calf Raise Maschine (Wadenheben)', s:'3×15', m:['calves']},
      {n:'— Core-Block —', s:''},
      {n:'Bauch-Crunchmaschine (Abdominal Crunch)', s:'3×15', m:['abs']},
      {n:'Plank (Unterarmstütz)', s:'3×40-60 Sek', m:['abs','lowerback']},
      {n:'Torso Rotation Maschine (Bauchdreher)', s:'3×15 je Seite', m:['obliques']},
      {n:'Beinheben hängend/liegend (Leg Raise)', s:'3×12', m:['abs','hips']},
    ]
  },
  3: { // Mittwoch
    type:'lauf', dot:'moss', label:'Zone 2 Lauf',
    title:'Lockerer Lauf',
    sub:'Matrix Spelle · Regeneration nach 2 harten Tagen',
    pills:['30-40 Min','Puls <145'],
    exercises:[
      {n:'Warm-up gehen', s:'5 Min'},
      {n:'Lockeres Tempo', s:'30-40 Min'},
      {n:'Sprich-Test einhalten', s:'Zone 2'},
      {n:'Cool-down + Dehnen', s:'5 Min'},
    ]
  },
  4: { // Donnerstag
    type:'choice', dot:'rust', label:'Training wählen',
    variants:{
      zirkel:{
        type:'zirkel', label:'Zirkeltraining',
        title:'Zirkeltraining · Physio Loft',
        sub:'Bootcamp-Style bei deinem Kumpel · Kraft + Ausdauer kombiniert',
        pills:['Kraft','Ausdauer','~45-60 Min'],
        exercises:[
          {n:'Vor dem Training kleine Mahlzeit', s:'90 Min vorher'},
          {n:'Wasserflasche mitnehmen', s:''},
          {n:'Zirkel durchziehen', s:'volle Runde'},
          {n:'Nach Training: Protein-Mahlzeit', s:'binnen 1-2h'},
        ]
      },
      gym:{
        type:'egym', label:'egym Training',
        title:'Ganzkörper / Schwachstellen',
        sub:'Eragym Bramsche/Recke oder Matrix Spelle · Ausgleich, was diese Woche zu kurz kam',
        pills:['Ganzkörper','Muskelaufbau','Technogym'],
        exercises:[
          {n:'Kniebeuge-Maschine (Smith Machine) oder Leg Press', s:'3×12', m:['quads','glutes','hamstrings']},
          {n:'Latzug (Lat Pulldown)', s:'3×12', m:['lats','biceps','forearms']},
          {n:'Schulterdrücken (Shoulder Press)', s:'3×12', m:['shoulders','triceps']},
          {n:'Bizeps-Curls Maschine (Biceps Curl)', s:'3×12', m:['biceps','forearms']},
          {n:'Trizeps-Drückmaschine (Triceps Press)', s:'3×12', m:['triceps']},
          {n:'— Core-Block —', s:''},
          {n:'Bauch-Crunchmaschine (Abdominal Crunch)', s:'3×15', m:['abs']},
          {n:'Dead Bug (Rückenlage, Arm/Bein wechselseitig)', s:'3×12', m:['abs']},
        ]
      }
    }
  },
  5: { // Freitag
    type:'egym', dot:'steel', label:'egym Training',
    title:'Oberkörper Pull + Core',
    sub:'Eragym Bramsche/Recke oder Matrix Spelle · Rücken, Arme, Bauch',
    pills:['Rücken','Arme','Muskelaufbau'],
    exercises:[
      {n:'Latzug (Lat Pulldown)', s:'4×10-12', m:['lats','biceps','forearms']},
      {n:'Rudermaschine (Seated Row)', s:'4×10-12', m:['lats','shoulders','biceps','traps','forearms']},
      {n:'Rückenstrecker (Back Extension)', s:'3×12', m:['lowerback']},
      {n:'Bizeps-Curls Maschine (Biceps Curl)', s:'3×12', m:['biceps']},
      {n:'Trizeps-Drückmaschine (Triceps Press)', s:'3×12', m:['triceps']},
      {n:'— Core-Block —', s:''},
      {n:'Seitliche Crunches (schräge Bauchmuskeln, Oblique Crunch)', s:'3×15 je Seite', m:['obliques']},
      {n:'Dead Bug (Rückenlage, Arm/Bein wechselseitig)', s:'3×12', m:['abs']},
      {n:'Optional: Ruderergometer (Rowing)', s:'3×500m', m:['lats','quads','shoulders','forearms']},
    ]
  },
  6: { // Samstag
    type:'lauf', dot:'moss', label:'Langer Lauf',
    title:'Langer Lauf',
    sub:'Kanal oder Spelle · Ausdauer-Basis aufbauen',
    pills:['55-70 Min','Puls <145'],
    exercises:[
      {n:'Frühstück 60-90 Min vorher', s:''},
      {n:'Warm-up gehen', s:'5 Min'},
      {n:'Lauf im lockeren Tempo', s:'55-70 Min'},
      {n:'Cool-down + Dehnen', s:''},
    ]
  },
  0: { // Sonntag
    type:'ruhe', dot:'gold', label:'Ruhetag + Push',
    title:'Ruhetag + kurzer Push-Block',
    sub:'Erholung priorisieren · optionaler Push in Eragym oder Matrix Spelle',
    pills:['Recovery','Push optional','Meal Prep'],
    exercises:[
      {n:'Ausschlafen / Erholung', s:''},
      {n:'— Optional, wenn fit (Eragym oder Matrix Spelle) —', s:''},
      {n:'Brustpresse (Chest Press)', s:'3×10-12', m:['chest','shoulders','triceps']},
      {n:'Schulterdrücken (Shoulder Press)', s:'3×12', m:['shoulders','triceps']},
      {n:'Seitheben-Maschine (Lateral Raise)', s:'3×15', m:['shoulders']},
      {n:'Trizeps-Drückmaschine (Triceps Press)', s:'3×12', m:['triceps']},
      {n:'Meal Prep für die Woche', s:'Hähnchen, Reis, Gemüse'},
      {n:'Wochenrückblick: was lief gut?', s:''},
    ]
  }
};

// ===== PHASE 2: AUFBAU (build) =====
// Erste Hyrox-Stationen + Brick-Workouts (Laufen mit müden Beinen). Baut auf der
// Basis auf, daher ...TRAINING_PLAN_BASE und nur die Schlüsseltage werden ersetzt.
const TRAINING_PLAN_BUILD = {
  ...TRAINING_PLAN_BASE,
  1: { // Montag: Zirkel-Variante wird zum Hyrox-Stationszirkel
    type:'choice', dot:'rust', label:'Training wählen',
    variants:{
      zirkel:{
        type:'zirkel', label:'Hyrox-Zirkel',
        title:'Hyrox-Stationen · Physio Loft',
        sub:'Bootcamp-Style — echte Hyrox-Bewegungen im Zirkel üben',
        pills:['Hyrox','Stationen','~50 Min'],
        exercises:[
          {n:'Warm-up: Rudern locker', s:'500m'},
          {n:'Sled Push (Schlitten schieben; sonst schwere Beinpresse)', s:'4×12,5m', m:['quads','glutes','calves','shoulders'], perf:{key:'sledpush', label:'Sled Push'}},
          {n:'Sled Pull (Schlitten ziehen; sonst Rudern schwer)', s:'4×12,5m', m:['lats','hamstrings','biceps','forearms'], perf:{key:'sledpull', label:'Sled Pull'}},
          {n:'Wall Balls (Ball über Linie werfen)', s:'4×20', perf:{key:'wallballs', label:'Wall Balls'}},
          {n:'Burpee Broad Jumps (Burpee + Weitsprung)', s:'4×10', perf:{key:'burpees', label:'Burpee Broad Jumps'}},
          {n:'Sandbag Lunges (Ausfallschritte mit Gewicht)', s:'4×20m', perf:{key:'lunges', label:'Sandbag Lunges'}},
          {n:'Farmers Carry (schwere Kurzhanteln tragen)', s:'4×40m', m:['forearms','traps','glutes'], perf:{key:'farmers', label:'Farmers Carry'}},
          {n:'Ruderergometer (Row)', s:'3×500m', m:['lats','quads','shoulders','forearms'], perf:{key:'row1k', label:'Rowing'}},
          {n:'Cool-down + Dehnen', s:''},
        ]
      },
      gym: TRAINING_PLAN_BASE[1].variants.gym // Push-Option unverändert
    }
  },
  2: { // Dienstag: Beine + Core, jetzt mit Sandbag/Walking Lunges
    ...TRAINING_PLAN_BASE[2],
    exercises:[
      ...TRAINING_PLAN_BASE[2].exercises,
      {n:'Walking Lunges mit Gewicht (Sandbag/KH)', s:'3×20m', m:['quads','glutes','hamstrings']},
    ]
  },
  3: { // Mittwoch: Zone-2-Lauf wird zum Brick-Workout
    type:'lauf', dot:'moss', label:'Brick-Workout',
    title:'Laufen + Stationen (Brick)',
    sub:'Matrix Spelle · Laufen mit müden Beinen — das Herz von Hyrox',
    pills:['Intervalle','Compromised Running','~40 Min'],
    exercises:[
      {n:'Warm-up locker laufen', s:'8 Min'},
      {n:'1 km zügig laufen', s:'Runde 1'},
      {n:'20 Wall Balls', s:''},
      {n:'1 km zügig laufen', s:'Runde 2'},
      {n:'15 Burpees', s:''},
      {n:'1 km zügig laufen', s:'Runde 3'},
      {n:'Cool-down + Dehnen', s:'5 Min'},
    ]
  },
  5: { // Freitag: Pull + Core mit Hyrox-Finisher
    ...TRAINING_PLAN_BASE[5],
    sub: TRAINING_PLAN_BASE[5].sub + ' · + Hyrox-Finisher',
    exercises:[
      ...TRAINING_PLAN_BASE[5].exercises,
      {n:'— Hyrox-Finisher —', s:''},
      {n:'SkiErg (oder Latzug explosiv)', s:'3×500m', m:['lats','triceps','abs','forearms'], perf:{key:'ski1k', label:'SkiErg'}},
      {n:'Farmers Carry (schwere Kurzhanteln)', s:'3×40m', m:['forearms','traps','glutes'], perf:{key:'farmers', label:'Farmers Carry'}},
      {n:'Ruderergometer (Row)', s:'1×1000m', m:['lats','quads','shoulders','forearms'], perf:{key:'row1k', label:'Rowing'}},
    ]
  }
};

// ===== PHASE 3: SPEZIFISCH (specific) =====
// Renntempo + Hyrox-Simulationen. Erbt die Hyrox-Tage aus der Aufbau-Phase,
// ersetzt Mi durch eine Lauf-Pyramide und Sa durch eine wechselnde Hyrox-Session.

// Samstag-Variante A: volle "Little Hyrox"-Generalprobe (ESN 8-Wochen-Plan, W7 S5).
// Nahezu maximal → soll NICHT jeden Samstag laufen, sonst häuft sich Ermüdung über
// den ~5-Wochen-Block. Läuft nur in geraden Wochen-bis-Rennen (6/4/2) → 3 gut
// verteilte Simulationen, die letzte ~2 Wochen vor dem Rennen.
const SPECIFIC_SAT_SIM = {
  type:'lauf', dot:'moss', label:'ESN Little Hyrox',
  title:'Little Hyrox – Generalprobe',
  sub:'Physio Loft Bramsche (alle Geräte inkl. SkiErg) · 2 Runden, Wettkampf simulieren',
  pills:['Simulation','2 Runden','~50-60 Min'],
  exercises:[
    {n:'— Warm-up: wettkampfspezifisch —', s:''},
    {n:'Aufwärmen wie am Renntag · Startzeit & Ernährung proben', s:''},
    {n:'— Little Hyrox · 2 Runden (R1 RPE 6-7 · R2 RPE 8) —', s:''},
    {n:'Ski', s:'300m', m:['lats','triceps','abs','forearms']},
    {n:'Run', s:'500m'},
    {n:'Sled Push', s:'25m', m:['quads','glutes','calves','shoulders']},
    {n:'Run', s:'500m'},
    {n:'Sled Push', s:'25m', m:['quads','glutes','calves','shoulders']},
    {n:'Run', s:'500m'},
    {n:'Farmer’s Carry', s:'100m', m:['forearms','traps','glutes']},
    {n:'Run', s:'500m'},
    {n:'Burpee Broad Jumps', s:'30x', m:['quads','glutes','chest','shoulders']},
    {n:'Lunges', s:'30x', m:['quads','glutes','hamstrings']},
    {n:'Run', s:'500m'},
    {n:'Wall Balls (RPE 9)', s:'50x', m:['quads','glutes','shoulders']},
    {n:'Cool-down: Locker Ergometer', s:'2000m'},
    {n:'Mobility & Stretching', s:'15min'},
  ]
};

// Samstag-Variante B: an den Zwischen-Samstagen (ungerade Wochen 5/3) lockerer langer
// Lauf + leichter Brick – Ausdauer halten, ohne Ermüdung anzuhäufen.
const SPECIFIC_SAT_LONG = {
  type:'lauf', dot:'moss', label:'Langer Lauf + lockerer Brick',
  title:'Langer Lauf + lockerer Brick',
  sub:'Kanal oder Spelle · Ausdauer halten, frisch bleiben (kein All-out)',
  pills:['60-75 Min','RPE 5-6','locker'],
  exercises:[
    {n:'— Warm-up —', s:''},
    {n:'Locker einlaufen + Mobilisieren', s:'10 Min'},
    {n:'— Langer Lauf (Zone 2) —', s:''},
    {n:'Lauf im lockeren Tempo', s:'55-65 Min'},
    {n:'— Lockerer Brick (optional, RPE 6) —', s:''},
    {n:'Wall Balls locker', s:'2 Runden · 20x', m:['quads','glutes','shoulders']},
    {n:'Row locker', s:'1000m', m:['lats','quads','shoulders','forearms']},
    {n:'Cool-down + Dehnen', s:'10 Min'},
  ]
};

const TRAINING_PLAN_SPECIFIC = {
  ...TRAINING_PLAN_BUILD,
  3: { // Mittwoch: ESN Lauf-Pyramide (aus dem ESN 8-Wochen-Plan, W3/W7 Session 4)
    type:'lauf', dot:'moss', label:'ESN Lauf-Pyramide',
    title:'Lauf-Pyramide',
    sub:'Matrix Spelle oder Kanal · ESN-Workout · Tempohärte aufbauen',
    pills:['Pyramide','RPE 7-8','200→1000→200 m'],
    exercises:[
      {n:'— Warm-up —', s:''},
      {n:'Lauf-ABC + kurze Steigerungsläufe (50-80m)', s:'15min'},
      {n:'— Workout: Pyramide RPE 7-8 · nach jedem Run 90 Sek Pause —', s:''},
      {n:'Run', s:'200m'},
      {n:'Run', s:'400m'},
      {n:'Run', s:'600m'},
      {n:'Run', s:'800m'},
      {n:'Run', s:'1000m'},
      {n:'Run', s:'800m'},
      {n:'Run', s:'600m'},
      {n:'Run', s:'400m'},
      {n:'Run', s:'200m'},
      {n:'— Je kürzer die Distanz, desto schneller —', s:''},
      {n:'Cool-down: Locker auslaufen (barfuß, falls möglich)', s:'2000m'},
    ]
  },
  // Samstag wechselt nach Wochen-bis-Rennen: gerade (6/4/2) = Little-Hyrox-Simulation,
  // ungerade (5/3) = lockerer langer Lauf. So 3 Sims statt 5 in Folge.
  6: { resolveByDate(d){ return (weeksUntilRace(d) % 2 === 0) ? SPECIFIC_SAT_SIM : SPECIFIC_SAT_LONG; } }
};

// ===== PHASE 4: TAPER =====
// WICHTIG: erbt NICHT mehr von BASE. Vorher liefen Mo/Di/Do/Fr/So als volles
// Hypertrophie-Maschinenprogramm weiter – falsch für einen Taper. Hier wird das
// Volumen drastisch gesenkt, nur die Bewegungen bleiben frisch. Wochenrhythmus geht
// von einem Samstags-Rennen aus (wie ESN-Plan); der tatsächliche Race Day wird aber
// datumsbasiert global gesetzt (siehe RACE_DAY/isRaceDay), egal welcher Wochentag.
// Aktiv in den letzten ~1-2 Wochen (weeksUntilRace 0-1).
const TRAINING_PLAN_TAPER = {
  1: { // Montag – kurze, lockere Aktivierung (kein Hypertrophie-Volumen)
    type:'egym', dot:'steel', label:'Kurze Aktivierung',
    title:'Locker bewegen, niedrige Last',
    sub:'Eragym/Matrix · Bewegungen wachhalten – Beine NICHT ermüden, kein schweres Maschinen-Volumen',
    pills:['Kurz','RPE 5-6','frisch bleiben'],
    exercises:[
      {n:'Ergometer einrudern / Bike (RPE 4–5)', s:'1500 m'},
      {n:'Ruderergometer locker', s:'2 Runden · 500 m', m:['lats','quads','shoulders','forearms']},
      {n:'Kreuzheben / KB-Deadlift leicht (nur Technik, kein Maximum)', s:'3×8', m:['hamstrings','glutes','lowerback']},
      {n:'Farmers Carry zügig', s:'2 Runden · 40 m', m:['forearms','traps','glutes']},
      {n:'Dehnen + Mobilisieren', s:'10 Min'},
    ]
  },
  2: { // Dienstag – lockerer Lauf mit kurzen Steigerungen
    type:'lauf', dot:'moss', label:'Lauf + Strides',
    title:'Lockerer Lauf mit Steigerungen',
    sub:'Matrix/Kanal · Beine wachhalten, nicht ausbelasten',
    pills:['~25-30 Min','locker + Strides'],
    exercises:[
      {n:'Warm-up locker', s:'10 Min'},
      {n:'Lockerer Dauerlauf', s:'15-20 Min'},
      {n:'4–5 Steigerungen (zügig, ~80 m, Gehpause)', s:''},
      {n:'Cool-down + Dehnen', s:'5 Min'},
    ]
  },
  3: { // Mittwoch – aktive Regeneration
    type:'ruhe', dot:'gold', label:'Aktive Regeneration',
    title:'Ganz locker bewegen',
    sub:'Erholung priorisieren · alles im Wohlfühltempo',
    pills:['Recovery','niedrige Last'],
    exercises:[
      {n:'Locker Rad / Schwimmen / Spaziergang', s:'20-30 Min'},
      {n:'Mobility + Dehnen', s:'10-15 Min'},
    ]
  },
  4: { // Donnerstag – Ruhe
    type:'ruhe', dot:'gold', label:'Ruhetag',
    title:'Ruhetag',
    sub:'Erholung · Beine schonen, Schlaf & Ernährung priorisieren',
    pills:['Rest','Mobility optional'],
    exercises:[
      {n:'Ausruhen / lockere Mobility', s:''},
      {n:'Schlaf & Ernährung priorisieren', s:''},
    ]
  },
  5: { // Freitag – kurze Aktivierung (typ. Tag vor dem Rennen)
    type:'lauf', dot:'moss', label:'Priming',
    title:'Kurze Aktivierung (Tag vor dem Rennen)',
    sub:'Körper primen, niedrige Last – morgen „on fire"',
    pills:['~20 Min','locker','priming'],
    exercises:[
      {n:'Ski / Run / Row je locker (RPE 4)', s:'je 1000 m'},
      {n:'Lunges ohne Gewicht', s:'2 Runden · 10', m:['quads','glutes','hamstrings']},
      {n:'2–3 kurze Steigerungen', s:'~200 m'},
      {n:'Locker auslaufen + Dehnen', s:''},
    ]
  },
  6: { // Samstag – kurze Auffrischung (am echten Renntag ersetzt RACE_DAY dies global)
    type:'lauf', dot:'moss', label:'Kurze Schärfe',
    title:'Kurze Hyrox-Auffrischung',
    sub:'Bewegungen frisch halten, niedrige Last · am Renntag erscheint hier automatisch der Race Day',
    pills:['~25 Min','locker'],
    exercises:[
      {n:'Locker einlaufen', s:'1000 m'},
      {n:'Wall Balls locker', s:'2 Runden · 15', m:['quads','glutes','shoulders']},
      {n:'Ski oder Row locker', s:'500 m', m:['lats','quads','shoulders','forearms']},
      {n:'2 kurze Steigerungen', s:'~150 m'},
      {n:'Dehnen + Mobilisieren', s:''},
    ]
  },
  0: { // Sonntag – Regeneration (vor oder nach dem Rennen)
    type:'ruhe', dot:'gold', label:'Erholung',
    title:'Regeneration',
    sub:'Locker bewegen, auffüllen, erholen',
    pills:['Recovery'],
    exercises:[
      {n:'Lockerer Spaziergang / leichtes Ausrollen', s:'20 Min'},
      {n:'Auffüllen: Protein + Kohlenhydrate', s:''},
      {n:'Wochenrückblick / nächstes Ziel', s:''},
    ]
  }
};

// Race Day: datumsbasiert (nicht an einen Wochentag gebunden, da Renndatum editierbar).
// Wird in planEntry global vor allen Phasen gesetzt, wenn d == Renndatum.
const RACE_DAY = {
  type:'ruhe', dot:'rust', label:'Race Day',
  title:'Race Day – Frankfurt',
  sub:'Wettkampf · Warm-up wie in der Generalprobe, Ernährung wie geplant. Viel Erfolg!',
  pills:['Wettkampf','viel Erfolg'],
  exercises:[
    {n:'Wettkampf-Warm-up (wie geprobt)', s:''},
    {n:'Frühstück / Ernährung wie geplant', s:''},
    {n:'Das Rennen genießen', s:''},
  ]
};

// Nach dem Rennen: ohne diesen Zustand würde weeksUntilRace negativ und phaseForDate
// dauerhaft auf Taper zurückfallen (App parkt still im Taper-Training). Stattdessen
// ein "Rennen vorbei – nächstes Ziel setzen?"-Zustand, bis ein neues Datum gesetzt ist.
const POST_RACE = {
  type:'ruhe', dot:'gold', label:'Rennen vorbei',
  title:'Rennen vorbei – nächstes Ziel?',
  sub:'Stark gemacht! 🎉 Setz im Tab „Verlauf" ein neues Renndatum – dann baut sich der ganze Plan automatisch neu auf. Bis dahin: locker erholen.',
  pills:['Erholung','nächstes Ziel setzen'],
  exercises:[
    {n:'Erholen & feiern 🎉', s:''},
    {n:'Neues Renndatum im Tab „Verlauf" setzen', s:''},
    {n:'Locker bewegen, wann du Lust hast', s:''},
  ]
};

// Phasen in Reihenfolge weit-vor-Rennen → kurz-vor-Rennen. minWeeks = ab so vielen
// Wochen bis Hyrox ist diese Phase aktiv (von oben nach unten geprüft).
const PHASES = [
  { key:'base',     label:'Grundaufbau', minWeeks:14, plan:TRAINING_PLAN_BASE,     blurb:'Kraft & Grundlagenausdauer aufbauen',
    highlights:['Kraft-/Maschinenplan (Push, Beine, Pull)','2 lockere Läufe (Zone 2 + langer Lauf)','Fokus: Muskelaufbau & Grundkondition'] },
  { key:'build',    label:'Aufbau',      minWeeks:7,  plan:TRAINING_PLAN_BUILD,    blurb:'Hyrox-Stationen & erste Brick-Workouts',
    highlights:['Hyrox-Stationszirkel (Mo) inkl. Sled Push/Pull','Brick-Workout statt Zone-2-Lauf (Mi)','Hyrox-Finisher: SkiErg, Farmers Carry, Row (Fr)'] },
  { key:'specific', label:'Spezifisch',  minWeeks:2,  plan:TRAINING_PLAN_SPECIFIC, blurb:'Renntempo & Hyrox-Simulationen',
    highlights:['ESN Lauf-Pyramide 200→1000→200 m (Mi)','„Little Hyrox" alle 2 Wochen, dazwischen langer Lauf (Sa)','Stationen auf Wettkampf-Tempo'] },
  { key:'taper',    label:'Taper',       minWeeks:0,  plan:TRAINING_PLAN_TAPER,    blurb:'Erholen & frisch werden',
    highlights:['Volumen drastisch runter – nur Bewegungen frisch halten','Lockere Läufe + Strides, aktive Regeneration & Ruhetage','Am Renntag erscheint automatisch der Race Day'] },
];

// Wochen bis zum Rennen für ein gegebenes Datum (aufgerundet).
function weeksUntilRace(d){
  return Math.ceil((getHyroxDate() - d) / (7*24*60*60*1000));
}
// Offset in Wochen für einen späteren Einstieg in die Periodisierung. Fittere
// Nutzer können den langen Grundaufbau überspringen (base→0, build→7, specific→12,
// berechnet aus den minWeeks). Wirkt NUR auf die Phasenwahl – NICHT auf
// weeksUntilRace, damit Countdown/Deload/Sim-Logik am echten Renndatum hängen.
function phaseStartOffset(){
  const key = state.profile && state.profile.startPhase;
  if(!key || key === 'base') return 0;
  const chosen = PHASES.find(p => p.key === key);
  return chosen ? (PHASES[0].minWeeks - chosen.minWeeks) : 0;
}
// Aktive Phase für ein Datum: erste Phase, deren minWeeks <= effektive Wochen ist.
function phaseForDate(d){
  const weeks = weeksUntilRace(d) - phaseStartOffset();
  return PHASES.find(p => weeks >= p.minWeeks) || PHASES[PHASES.length-1];
}
// Ist d der (editierbare) Renntag? Vergleich auf Kalendertag, kein UTC.
function isRaceDay(d){
  const r = getHyroxDate();
  return d.getFullYear()===r.getFullYear() && d.getMonth()===r.getMonth() && d.getDate()===r.getDate();
}
// Liegt d (kalendertäglich) NACH dem Renntag? Dann ist das Rennen vorbei.
function isPostRace(d){
  const r = getHyroxDate();
  const dd = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const rr = new Date(r.getFullYear(), r.getMonth(), r.getDate());
  return dd > rr;
}
// Plan-Eintrag (Tag) für Wochentag + Datum, aufgelöst über die aktive Phase.
// Renntag schlägt alles (RACE_DAY); nach dem Rennen POST_RACE (sonst parkt die App
// dauerhaft im Taper). Hat ein Eintrag sonst eine resolveByDate(d)-Funktion, variiert
// er je nach Datum (z.B. Samstag der Spezifisch-Phase: Simulation nur alle 2 Wochen).
function planEntry(dow, d){
  if(isRaceDay(d)) return RACE_DAY;
  if(isPostRace(d)) return POST_RACE;
  const entry = phaseForDate(d).plan[dow];
  if(entry && typeof entry.resolveByDate === 'function') return entry.resolveByDate(d);
  return entry;
}

// Montag der Woche, in der d liegt (lokale Zeit, kein UTC).
function mondayOf(d){
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const back = (x.getDay()+6)%7; // Mo=0 … So=6
  x.setDate(x.getDate()-back);
  return x;
}
// Deload-Woche? Alle ~4 Wochen eine Entlastungswoche (rennbezogen verankert am
// Montag der Woche). Greift nur im Block davor (≥6 Wochen vor dem Rennen): die
// Spitzenwochen (2-5) bleiben hart, der Taper (0-1) ist ohnehin schon Entlastung.
function isDeloadWeek(d){
  if(isRaceDay(d) || isPostRace(d)) return false;
  const weeks = weeksUntilRace(mondayOf(d));
  return weeks >= 6 && (weeks - 6) % 4 === 0;
}

// ===== ESN 8-WOCHEN-PLAN (Referenz) =====
// 1:1 aus dem ESN Hyrox Vorbereitungs-PDF übernommen. Reiner Nachschlage-/Abhak-Plan,
// unabhängig vom eigenen Phasen-Wochenplan. Block-Typen: warm/work/cool.
// items: {n:'Übung', s:'Menge'} · meta: Runden/RPE-Zeile · note: Zusatzinfos.
// SkiErg gibt's nur im Physio Loft Bramsche – Sessions mit Ski werden markiert.
const ESN_PLAN = {
  weeks: [
    { n:1, sessions:[
      { name:'Session 1', sub:'Kraft + Sled · Ski/Row', blocks:[
        { head:'Warm-up', meta:'3 Runden · RPE 5', items:[
          {n:'Ski', s:'500m'}, {n:'Row', s:'500m'},
          {n:'Run (direkt danach)', s:'3000m'},
        ], note:'Run: 1000m im WK-Tempo, dann 2000m 45 Sek langsamer.' },
        { head:'Workout', meta:'2 Durchgänge · 3 Runden · RPE 7', items:[
          {n:'Kreuzheben', s:'12x'}, {n:'Sled Pull', s:'12,5m'},
          {n:'Kreuzheben', s:'12x'}, {n:'Lockerer Lauf', s:'5min'},
        ], note:'3 Runden ohne Pause, schneller Stationswechsel. Dann 5 Min aktive Pause auf dem BikeErg (RPE 3) → Durchgang 2.' },
        { head:'Cool-down', items:[{n:'Ski', s:'3000m'}] },
      ]},
      { name:'Session 2', sub:'Lauf-Intervalle + Burpees', blocks:[
        { head:'Warm-up', items:[{n:'Row', s:'4000m'}, {n:'Run', s:'2000m'}] },
        { head:'Workout', meta:'8 Runden · RPE 8', items:[
          {n:'Run', s:'800m'}, {n:'Burpee Broad Jumps', s:'20x'}, {n:'Pause', s:'90sek'},
        ]},
        { head:'Cool-down', items:[{n:'Locker auslaufen (barfuß, falls möglich)', s:'10min'}] },
      ]},
      { name:'Session 3', sub:'Wall Balls + Burpees · Ski', blocks:[
        { head:'Warm-up', items:[{n:'Ski', s:'2000m'}, {n:'Row', s:'2000m'}], note:'Beginnend RPE 4, Steigerung auf RPE 6.' },
        { head:'Workout', meta:'10 Runden', items:[
          {n:'Wall Balls', s:'40x'}, {n:'Burpee Broad Jumps', s:'15x'},
          {n:'Ski', s:'200m'}, {n:'Pause', s:'90sek'},
          {n:'Direkt danach: Wall Balls am Stück', s:'100x'},
        ], note:'Runden 1-2 RPE 5 (Warm-up), Runden 3-9 RPE 7 (konstantes Tempo), Runde 10 RPE 9 – all out!' },
        { head:'Cool-down', items:[{n:'Locker auslaufen', s:'3000m'}] },
      ]},
      { name:'Session 4', sub:'Langer Grundlagenlauf', blocks:[
        { head:'Warm-up', items:[{n:'Aktive Beweglichkeit (Beinschwünge, Armkreise, Lauf-ABC)', s:'10min'}] },
        { head:'Workout', meta:'RPE 4', items:[{n:'Run', s:'80min'}] , note:'Oder: 10 Min Ski/Row + 60 Min Run + 10 Min Ski/Row.' },
        { head:'Cool-down', items:[{n:'Stretching und Mobility', s:''}] },
      ]},
    ]},
    { n:2, sessions:[
      { name:'Session 1', sub:'Bike/Sled-Intervalle', blocks:[
        { head:'Warm-up', meta:'3 Runden · RPE 5', items:[
          {n:'Ski', s:'500m'}, {n:'KB-Deadlifts', s:'15x'},
          {n:'Pushups', s:'10x'}, {n:'Burpees', s:'10x'},
        ]},
        { head:'Workout', meta:'5 Runden · RPE 7-8', items:[
          {n:'Bike', s:'4min'}, {n:'Sled Pull', s:'2min'},
          {n:'Run im WK-Tempo', s:'1min'}, {n:'Lunges', s:'2min'},
          {n:'Run im WK-Tempo', s:'3min'}, {n:'Pause', s:'2min'},
        ]},
        { head:'Cool-down', items:[{n:'Lockeres Rudern', s:'10min'}] },
      ]},
      { name:'Session 2', sub:'Farmer’s Carry + Tempolauf', blocks:[
        { head:'Warm-up', items:[{n:'Aktive Beweglichkeit', s:'10min'}] },
        { head:'Workout', meta:'3 Runden · RPE 8', items:[
          {n:'Farmer’s Carry', s:'200m'}, {n:'Run im WK-Tempo', s:'3000m'}, {n:'Pause', s:'4min'},
        ]},
        { head:'Cool-down', items:[{n:'Stretching / Mobility', s:'10min'}] },
      ]},
      { name:'Session 3', sub:'Thruster/Wall-Ball-Leiter · Ski', blocks:[
        { head:'Warm-up', meta:'RPE 5', items:[{n:'Row', s:'15min'}, {n:'Run', s:'15min'}, {n:'Ski', s:'15min'}] },
        { head:'Workout', meta:'Abwärtsleiter · RPE 7-8', items:[
          {n:'Thruster → Wall Balls', s:'20x / 20x'},
          {n:'Thruster → Wall Balls', s:'18x / 18x'},
          {n:'Thruster → Wall Balls', s:'16x / 16x'},
          {n:'Thruster → Wall Balls', s:'14x / 14x'},
          {n:'Thruster → Wall Balls', s:'12x / 12x'},
          {n:'Direkt danach: Run (RPE 7)', s:'2000m'},
        ], note:'Thruster mit leerer Hantel (M 20 kg / F 15 kg).' },
        { head:'Cool-down', items:[{n:'Locker auslaufen', s:'3000m'}] },
      ]},
      { name:'Session 4', sub:'Row/Lauf-Mix + langer Tempolauf', blocks:[
        { head:'Warm-up', meta:'3 Runden', items:[
          {n:'Run (RPE 4)', s:'500m'}, {n:'Pushups', s:'10x'},
          {n:'Burpees', s:'10x'}, {n:'Air Squats', s:'10x'},
        ]},
        { head:'Workout', meta:'6 Runden · RPE 7', items:[
          {n:'Row (300m locker, 200m schnell)', s:'500m'},
          {n:'Burpee Broad Jumps', s:'20x'},
          {n:'Run im WK-Tempo', s:'500m'}, {n:'Lunges', s:'20x'},
          {n:'Direkt danach: Run im WK-Tempo', s:'3000m'},
        ]},
        { head:'Cool-down', items:[{n:'Locker auslaufen (barfuß, falls möglich)', s:'10min'}] },
      ]},
    ]},
    { n:3, sessions:[
      { name:'Session 1', sub:'Sled Push + Bike-Intervalle', blocks:[
        { head:'Warm-up', items:[{n:'Aktive Beweglichkeit', s:'10min'}] },
        { head:'Workout', meta:'8 Runden', items:[
          {n:'Sled Push', s:'40m'}, {n:'Bike', s:'3min'},
          {n:'Run im WK-Tempo', s:'2min'}, {n:'Pause', s:'90sek'},
        ], note:'Runden 1-2 locker RPE 5, Runden 3-7 konstant RPE 7, Runde 8 Finisher RPE 8-9.' },
        { head:'Cool-down', items:[{n:'Stretching / Mobility', s:''}] },
      ]},
      { name:'Session 2', sub:'Progressiver 10 km', blocks:[
        { head:'Warm-up', items:[{n:'Aktive Beweglichkeit', s:'10min'}] },
        { head:'Workout', items:[{n:'Run progressiv RPE 4 → RPE 10', s:'10km'}], note:'Ganz locker starten, alle 2 km steigern – die letzten 2 km all out!' },
        { head:'Cool-down', items:[{n:'Locker Ski', s:'3000m'}] },
      ]},
      { name:'Session 3', sub:'Row/Wall-Ball-Pyramide', blocks:[
        { head:'Warm-up', meta:'RPE 5', items:[{n:'Run', s:'2000m'}, {n:'Row', s:'1000m'}] },
        { head:'Workout', meta:'Pyramide · RPE 7-8', items:[
          {n:'Row 100m → Wall Balls', s:'10x'}, {n:'Row 200m → Wall Balls', s:'12x'},
          {n:'Row 300m → Wall Balls', s:'13x'}, {n:'Row 400m → Wall Balls', s:'14x'},
          {n:'Row 500m → Wall Balls', s:'15x'}, {n:'Row 600m → Wall Balls', s:'16x'},
          {n:'Row 500m → Wall Balls', s:'15x'}, {n:'Row 400m → Wall Balls', s:'14x'},
          {n:'Row 300m → Wall Balls', s:'13x'}, {n:'Row 200m → Wall Balls', s:'12x'},
          {n:'Row 100m → Wall Balls', s:'10x'},
        ], note:'Wall Balls evtl. 1 Stufe über WK-Gewicht. Row-Tempo: je kürzer die Distanz, desto schneller.' },
        { head:'Cool-down', items:[{n:'Locker Bike', s:'10min'}, {n:'Mobility und Stretching', s:'10-15min'}] },
      ]},
      { name:'Session 4', sub:'Lauf-Pyramide', blocks:[
        { head:'Warm-up', items:[{n:'Aktive Beweglichkeit', s:'10-20min'}] },
        { head:'Workout', meta:'Pyramide · RPE 7-8', items:[
          {n:'Run', s:'200m'}, {n:'Run', s:'400m'}, {n:'Run', s:'600m'},
          {n:'Run', s:'800m'}, {n:'Run', s:'1000m'}, {n:'Run', s:'800m'},
          {n:'Run', s:'600m'}, {n:'Run', s:'400m'}, {n:'Run', s:'200m'},
        ], note:'Nach jedem Run 90 Sek Pause. Je kürzer die Distanz, desto schneller.' },
        { head:'Cool-down', items:[{n:'Locker auslaufen', s:'2000m'}] },
      ]},
    ]},
    { n:4, sessions:[
      { name:'Session 1', sub:'Ski/Sled-Leiter · Ski', blocks:[
        { head:'Warm-up', items:[
          {n:'Run RPE 4 → Bike RPE 4', s:'5min / 5min'},
          {n:'Run RPE 6 → Bike RPE 6', s:'5min / 5min'},
        ]},
        { head:'Workout', meta:'Abwärts-Aufwärts-Leiter · RPE 7-8', items:[
          {n:'Ski 500m → Sled Push 50m', s:''}, {n:'Run 500m → Wall Balls', s:'10x'},
          {n:'Ski 400m → Sled Push 40m', s:''}, {n:'Run 400m → Wall Balls', s:'15x'},
          {n:'Ski 300m → Sled Push 30m', s:''}, {n:'Run 300m → Wall Balls', s:'20x'},
          {n:'Ski 200m → Sled Push 20m', s:''}, {n:'Run 200m → Wall Balls', s:'30x'},
        ], note:'Ski-Tempo: je kürzer desto schneller. Run konstant locker/stabil RPE 5.' },
        { head:'Cool-down', items:[{n:'Locker rudern', s:'10min'}] },
      ]},
      { name:'Session 2', sub:'Grundlagenlauf 12 km', blocks:[
        { head:'Warm-up', meta:'RPE 4', items:[{n:'Run', s:'2000m'}] },
        { head:'Workout', meta:'RPE 5', items:[{n:'Grundlagenlauf', s:'12km'}] },
        { head:'Cool-down', items:[{n:'Stretching und Mobility', s:'10-20min'}] },
      ]},
      { name:'Session 3', sub:'Wall Balls + KB-Komplex + Finisher', blocks:[
        { head:'Warm-up', meta:'3 Runden', items:[
          {n:'Air Squats', s:'6x'}, {n:'Pushups', s:'5x'},
          {n:'Box Jumps', s:'5x'}, {n:'Pullups', s:'3x'},
        ]},
        { head:'Workout A', meta:'10 Runden · alle 80 Sek', items:[
          {n:'Wall Balls', s:'10x'}, {n:'Air Squats', s:'20x'},
        ], note:'WB evtl. über WK-Gewicht, so schnell wie möglich. Danach 3 Min Pause.' },
        { head:'Workout B', meta:'KB-Komplex', items:[
          {n:'KB Swings → Pushups', s:'14x / 14x'},
          {n:'KB Swings → Pushups', s:'10x / 10x'},
          {n:'KB Swings → Pushups', s:'14x / 14x'},
          {n:'KB Swings → Pushups (RPE 8)', s:'10x / 100x'},
        ], note:'So schnell wie möglich bei sauberer Ausführung. Ohne Pause direkt weiter zum Finisher.' },
        { head:'Finisher', items:[
          {n:'Bike (RPE 7-8)', s:'1000m'}, {n:'Run (RPE 7-8)', s:'1000m'},
        ]},
        { head:'Cool-down', items:[{n:'Locker auslaufen', s:'10min'}] },
      ]},
      { name:'Session 4', sub:'Lunges + Lauf-Intervalle', blocks:[
        { head:'Warm-up', items:[
          {n:'Run mit Tempowechseln + kurzen Steigerungen', s:'2000m'},
          {n:'Mobility und aktive Beweglichkeit', s:'5-10min'},
        ]},
        { head:'Workout', meta:'6 Runden · RPE 8', items:[
          {n:'Lunges', s:'30x'}, {n:'Run', s:'1000m'},
          {n:'Burpee Broad Jumps', s:'10x'}, {n:'Pause', s:'90sek'},
        ]},
        { head:'Cool-down', items:[{n:'Auslaufen (Hälfte barfuß, falls möglich)', s:'3000m'}] },
      ]},
    ]},
    { n:5, sessions:[
      { name:'Session 1', sub:'Bike + Lauf-Intervalle', blocks:[
        { head:'Warm-up', items:[{n:'Bike RPE 4', s:'30min'}, {n:'Run RPE 6', s:'2000m'}] },
        { head:'Workout', meta:'4 Runden', items:[
          {n:'Run RPE 5', s:'200m'}, {n:'Lunges', s:'20x'}, {n:'Run RPE 8', s:'200m'},
        ]},
        { head:'Cool-down', items:[{n:'Stretching und Mobility', s:'15min'}] },
      ]},
      { name:'Session 2', sub:'Sled Pull Komplex · Ski', blocks:[
        { head:'Warm-up', items:[
          {n:'Ski RPE 5', s:'10min'}, {n:'Sled Pull mit 20 kg', s:'12,5m'},
        ], note:'Nach jeder Bahn um 20 kg steigern, bis du beim WK-Gewicht bist.' },
        { head:'Workout', meta:'8 Runden · RPE 8', items:[
          {n:'Sled Pull', s:'12,5m'}, {n:'Burpee Broad Jumps', s:'12,5m'},
          {n:'Lunges', s:'12,5m'}, {n:'Run im WK-Tempo', s:'1min'}, {n:'Pause', s:'90sek'},
        ]},
        { head:'Cool-down', items:[{n:'Bike locker', s:'15min'}] },
      ]},
      { name:'Session 3', sub:'2× 5 km Tempolauf · Ski', blocks:[
        { head:'Warm-up', items:[{n:'Ski RPE 4', s:'3000m'}] },
        { head:'Workout', items:[
          {n:'Run RPE 6', s:'5000m'}, {n:'Pause', s:'4min'}, {n:'Run RPE 8', s:'5000m'},
        ]},
        { head:'Cool-down', items:[{n:'Row', s:'2000m'}, {n:'Stretching und Mobility', s:'15min'}] },
      ]},
    ]},
    { n:6, sessions:[
      { name:'Session 1', sub:'Hyrox-Mix Intervalle · Ski', blocks:[
        { head:'Warm-up', items:[{n:'Ski', s:'2500m'}, {n:'Row', s:'2500m'}], note:'Im Wechsel 500m RPE 4 / 500m RPE 6, konstante Schlagzahl mit Fokus aufs Tempogefühl.' },
        { head:'Workout', meta:'8 Runden · RPE 7-8', items:[
          {n:'Run im WK-Tempo', s:'1min'}, {n:'Burpee Broad Jumps', s:'1min'},
          {n:'Farmer’s Carry', s:'1min'}, {n:'Wall Balls unbroken', s:'1min'}, {n:'Pause', s:'1min'},
        ]},
        { head:'Cool-down', items:[{n:'Locker auslaufen (davon 2000m barfuß, falls möglich)', s:'5000m'}] },
      ]},
      { name:'Session 2', sub:'10 km Lunge-Run', blocks:[
        { head:'Warm-up', items:[{n:'Bike RPE 4', s:'20min'}, {n:'Bike RPE 7', s:'10min'}], note:'Direkter, schneller Wechsel zum Workout!' },
        { head:'Workout', items:[
          {n:'Lunges RPE 8', s:'40m'}, {n:'Run RPE 7-8', s:'200m'}, {n:'Run RPE 5', s:'760m'},
        ], note:'10 km Lunge-Run – diese 3 Abschnitte im Wechsel wiederholen.' },
        { head:'Cool-down', items:[{n:'Bike locker', s:'15min'}] },
      ]},
      { name:'Session 3', sub:'Row/Sled/Wall-Ball-Intervalle', blocks:[
        { head:'Warm-up', meta:'3 Runden · RPE 5', items:[
          {n:'Run', s:'3min'}, {n:'Pushups', s:'20x'},
          {n:'Air Squats', s:'10x'}, {n:'KB-Swings', s:'20x'},
        ]},
        { head:'Workout', meta:'5 Runden · RPE 7-8', items:[
          {n:'Row', s:'2min'}, {n:'Sled Push (2 Bahnen)', s:'25m'},
          {n:'Run im WK-Tempo', s:'1min'}, {n:'Wall Balls (3×15, je 10 Sek Pause)', s:'45x'},
        ]},
        { head:'Cool-down', items:[{n:'Stretching und Mobility', s:'15min'}] },
      ]},
      { name:'Session 4', sub:'Tempodauerlauf 12 km', blocks:[
        { head:'Warm-up', items:[{n:'Lauf-ABC', s:'10-15min'}] },
        { head:'Workout', items:[{n:'Tempodauerlauf RPE 7-8', s:'12km'}] },
        { head:'Cool-down', items:[{n:'Stretching und Mobility', s:'15min'}] },
      ]},
    ]},
    { n:7, sessions:[
      { name:'Session 1', sub:'Row/KB/Carry + 4 km Lauf', blocks:[
        { head:'Warm-up', items:[
          {n:'Row', s:'500m'}, {n:'KB-Deadlifts', s:'12x'}, {n:'Farmer’s Carry', s:'80m'},
        ], note:'Direkt ohne Pause weiter ins Workout!' },
        { head:'Workout', meta:'5 Runden · RPE 7', items:[
          {n:'Row', s:'500m'}, {n:'Double-KB-Deadlifts', s:'12x'},
          {n:'Farmer’s Carry', s:'80m'}, {n:'Direkt danach: Run RPE 5', s:'4000m'},
        ], note:'Konstante Belastung und Tempo, keine Pausen!' },
        { head:'Cool-down', items:[{n:'Stretching und Mobility', s:'15min'}] },
      ]},
      { name:'Session 2', sub:'Lauf + Box Jumps', blocks:[
        { head:'Warm-up', items:[
          {n:'Lauf-ABC', s:'10min'},
          {n:'Kurze Sprungserien (Hocksprünge, Boundings, Single-Leg-Hops)', s:''},
        ]},
        { head:'Workout', meta:'15 Runden · RPE 6-7', items:[
          {n:'Run', s:'400m'}, {n:'Box Jumps (alt. Hocksprünge)', s:'20x'},
        ], note:'Konstantes Tempo, ohne Pausen!' },
        { head:'Cool-down', items:[{n:'Stretching und Mobility', s:'15min'}] },
      ]},
      { name:'Session 3', sub:'Ski/Wall-Ball-Pyramide · Ski', blocks:[
        { head:'Warm-up', meta:'RPE 5', items:[{n:'Run', s:'2000m'}] },
        { head:'Workout', meta:'Pyramide · RPE 7-8', items:[
          {n:'Ski 100m → Wall Balls', s:'10x'}, {n:'Ski 200m → Wall Balls', s:'12x'},
          {n:'Ski 300m → Wall Balls', s:'13x'}, {n:'Ski 400m → Wall Balls', s:'14x'},
          {n:'Ski 500m → Wall Balls', s:'15x'}, {n:'Ski 600m → Wall Balls', s:'16x'},
          {n:'Ski 500m → Wall Balls', s:'15x'}, {n:'Ski 400m → Wall Balls', s:'14x'},
          {n:'Ski 300m → Wall Balls', s:'13x'}, {n:'Ski 200m → Wall Balls', s:'12x'},
          {n:'Ski 100m → Wall Balls', s:'10x'},
        ], note:'Wall Balls evtl. 1 Stufe über WK-Gewicht. Ski-Tempo: je kürzer desto schneller.' },
        { head:'Cool-down', items:[{n:'Locker auslaufen (Hälfte barfuß)', s:'3000m'}, {n:'Mobility und Stretching', s:'10-15min'}] },
      ]},
      { name:'Session 4', sub:'Lauf-Pyramide', blocks:[
        { head:'Warm-up', items:[{n:'Lauf-ABC + kurze Steigerungsläufe (50-80m)', s:'15min'}] },
        { head:'Workout', meta:'Pyramide · RPE 7-8', items:[
          {n:'Run', s:'200m'}, {n:'Run', s:'400m'}, {n:'Run', s:'600m'},
          {n:'Run', s:'800m'}, {n:'Run', s:'1000m'}, {n:'Run', s:'800m'},
          {n:'Run', s:'600m'}, {n:'Run', s:'400m'}, {n:'Run', s:'200m'},
        ], note:'Je kürzer desto schneller. Nach jedem Run 90 Sek Pause.' },
        { head:'Cool-down', items:[{n:'Run locker (barfuß, falls möglich)', s:'2000m'}] },
      ]},
      { name:'Session 5', sub:'Little Hyrox (Generalprobe) · Ski', blocks:[
        { head:'Warm-up', info:true, note:'Wettkampfspezifisch aufwärmen – heute absolvierst du einen „Little Hyrox". Halte Ernährung & Tagesablauf (inkl. Startzeit) wie am Wettkampftag.' },
        { head:'Little Hyrox', meta:'2 Runden', items:[
          {n:'Ski', s:'300m'}, {n:'Run', s:'500m'},
          {n:'Sled Push', s:'25m'}, {n:'Run', s:'500m'},
          {n:'Sled Push', s:'25m'}, {n:'Run', s:'500m'},
          {n:'Farmer’s Carry', s:'100m'}, {n:'Run', s:'500m'},
          {n:'Burpee Broad Jumps', s:'30x'}, {n:'Lunges', s:'30x'},
          {n:'Run', s:'500m'}, {n:'Wall Balls', s:'50x'},
        ], note:'Runde 1 RPE 6-7, Runde 2 RPE 8, Wall Balls RPE 9.' },
        { head:'Cool-down', items:[{n:'Locker Ergometer', s:'2000m'}, {n:'Mobility und Stretching', s:'15min'}] },
      ]},
    ]},
    { n:8, note:'Tapering-Woche (die Woche vor dem Rennen): Volumen runter, Intensität in kurzer Dauer hoch halten. Mittwoch & Donnerstag aktive Regeneration (locker Laufen/Rad/Schwimmen). Freitag kurzes Aktivierungstraining. Samstag = Race Day.', sessions:[
      { name:'Session 1 · Montag', sub:'Row/KB-Kraft', blocks:[
        { head:'Warm-up', meta:'3000m Ergometer', items:[
          {n:'Ergometer RPE 4', s:'1000m'}, {n:'Ergometer RPE 6', s:'1000m'}, {n:'Ergometer RPE 8', s:'1000m'},
        ]},
        { head:'Workout', meta:'4 Runden · RPE 7', items:[
          {n:'Row', s:'500m'}, {n:'Double-KB-Deadlifts', s:'12x'}, {n:'Farmer’s Carry', s:'40m'},
        ], note:'Double-KB-Deadlifts mit Wettkampfgewicht oder schwerer.' },
        { head:'Cool-down', items:[{n:'Stretching und Mobility', s:'15min'}] },
      ]},
      { name:'Session 2 · Dienstag', sub:'Burpees + Steigerungen', blocks:[
        { head:'Warm-up', items:[{n:'Run', s:'3000m'}] },
        { head:'Workout', meta:'4 Runden', items:[
          {n:'Broad Jump Burpees (RPE 7-8)', s:'20x'},
          {n:'Steigerungslauf (RPE 7-8)', s:'200m'}, {n:'Pause', s:'90sek'},
        ]},
        { head:'Cool-down', items:[{n:'Locker laufen (barfuß, falls möglich)', s:'2000m'}, {n:'Mobility und Stretching', s:'20min'}] },
      ]},
      { name:'Mittwoch & Donnerstag', sub:'Aktive Regeneration', blocks:[
        { head:'Regeneration', info:true, note:'Körper locker durchbewegen: locker Laufen, Rad fahren oder Schwimmen. Kein hartes Training.' },
      ]},
      { name:'Session 3 · Freitag', sub:'Kurze Aktivierung · Ski', blocks:[
        { head:'Warm-up', meta:'RPE 4', items:[{n:'Ski', s:'1000m'}, {n:'Run', s:'1000m'}, {n:'Row', s:'1000m'}] },
        { head:'Workout', meta:'3 Runden', items:[
          {n:'Lunges (ohne Gewicht)', s:'10x'}, {n:'Lockerer, aber zügiger Steigerungslauf', s:'200m'},
        ]},
        { head:'Cool-down', items:[{n:'Locker laufen (barfuß, falls möglich)', s:'1000m'}, {n:'Aktive Beweglichkeit und Regeneration', s:''}] },
      ]},
      { name:'Samstag · Race Day', sub:'Frankfurt – los geht’s!', blocks:[
        { head:'Race Day', info:true, note:'Heute zählt’s. Nichts Neues essen – nur Bewährtes. Gut getimter Ablauf & Warm-up wie geprobt. Viel Erfolg! 🏁' },
      ]},
    ]},
  ]
};

const FOOD_PLAN = {
  1: { day:'Mo', meals:[
    {time:'9:30 Frühstück', name:'Quark-Schüssel', kcal:'~400 kcal', items:'250 g Magerquark · 30 g Haferflocken · Beeren · 1 EL Honig'},
    {time:'12:00 Mittag', name:'Hähnchen & Reis', kcal:'~580 kcal', items:'180 g Hähnchenbrust · 150 g Reis · Paprika/Gurke roh'},
    {time:'Nach Zirkel', name:'Protein-Mahlzeit', kcal:'~300 kcal', items:'Shake oder Quark + Obst, binnen 1-2h nach Training'},
    {time:'16:30 Snack', name:'Skyr & Banane', kcal:'~450 kcal', items:'250 g Skyr · Banane · 20 g Erdnussmus'},
    {time:'19:00 Abend', name:'Lachs & Gemüse', kcal:'~520 kcal', items:'180 g Lachs im Ofen · Brokkoli · 100 g Kartoffeln'},
  ], zirkelMeals:[
    {time:'9:30 Frühstück', name:'Quark-Schüssel', kcal:'~400 kcal', items:'250 g Magerquark · 30 g Haferflocken · Beeren · 1 EL Honig'},
    {time:'12:00 Mittag', name:'Hähnchen & Reis', kcal:'~580 kcal', items:'180 g Hähnchenbrust · 150 g Reis · Paprika/Gurke roh'},
    {time:'16:00 Pre-Workout', name:'Skyr & Banane', kcal:'~450 kcal', items:'250 g Skyr · Banane · 20 g Erdnussmus · gut verdaulich vor dem Training'},
    {time:'18:00 Training', name:'Zirkeltraining · Physio Loft', kcal:'', items:'~45-60 Min · Wasserflasche mitnehmen', marker:true},
    {time:'19:45 Nach Training', name:'Protein-Mahlzeit', kcal:'~300 kcal', items:'Shake oder Quark + Obst, binnen 1-2h nach Training'},
    {time:'21:00 Abend', name:'Lachs & Gemüse', kcal:'~520 kcal', items:'180 g Lachs im Ofen · Brokkoli · 100 g Kartoffeln'},
  ]},
  2: { day:'Di', meals:[
    {time:'9:30 Frühstück', name:'Overnight Oats', kcal:'~420 kcal', items:'40 g Haferflocken · 200 ml Milch · 150 g Joghurt · Beeren'},
    {time:'12:15 Mittag', name:'Putenhack-Bowl', kcal:'~560 kcal', items:'200 g Putenhack · 100 g Reisnudeln · Zucchini · Sojasoße'},
    {time:'Snacks Vorm.+Nachm.', name:'Quark-Bowl & Obst', kcal:'~800 kcal', items:'250 g Magerquark · 40 g Haferflocken · Banane · 30 g Nüsse · Apfel'},
    {time:'19:00 Abend', name:'Eier & Gemüse', kcal:'~480 kcal', items:'3 Eier · 100 g Feta · Spinat · 1 Scheibe Vollkornbrot'},
  ]},
  3: { day:'Mi', meals:[
    {time:'9:30 Frühstück', name:'Skyr-Bowl', kcal:'~430 kcal', items:'200 g Skyr · 30 g Granola · Obst'},
    {time:'12:00 Mittag', name:'Rinderhack & Süßkartoffel', kcal:'~600 kcal', items:'200 g mageres Rinderhack · 150 g Süßkartoffeln · Möhren'},
    {time:'Snacks Vorm.+Nachm.', name:'Hüttenkäse & Banane', kcal:'~770 kcal', items:'200 g Hüttenkäse · 1 Scheibe Vollkornbrot · Banane · 30 g Nüsse'},
    {time:'19:00 Abend', name:'Thunfisch-Bowl', kcal:'~450 kcal', items:'2 Dosen Thunfisch · 80 g Quinoa · Gurke · Tomaten · Zitrone'},
  ]},
  4: { day:'Do', meals:[
    {time:'9:30 Frühstück', name:'Joghurt-Schüssel', kcal:'~380 kcal', items:'200 g griech. Joghurt 0% · Leinsamen · Banane · Beeren'},
    {time:'12:15 Mittag', name:'Linsensuppe + Hähnchen', kcal:'~500 kcal', items:'250 ml Linsensuppe + 150 g Hähnchen dazu'},
    {time:'Nach Zirkel', name:'Protein-Mahlzeit', kcal:'~300 kcal', items:'Shake oder Quark, binnen 1-2h nach Training'},
    {time:'16:30 Snack', name:'Skyr & Nüsse', kcal:'~600 kcal', items:'250 g Skyr · 30 g Nüsse · Banane · 1 EL Honig'},
    {time:'19:00 Abend', name:'Omelett', kcal:'~480 kcal', items:'4 Eier · 80 g Feta · Spinat · Tomaten · 1 Scheibe Vollkornbrot'},
  ], zirkelMeals:[
    {time:'9:30 Frühstück', name:'Joghurt-Schüssel', kcal:'~380 kcal', items:'200 g griech. Joghurt 0% · Leinsamen · Banane · Beeren'},
    {time:'12:15 Mittag', name:'Linsensuppe + Hähnchen', kcal:'~500 kcal', items:'250 ml Linsensuppe + 150 g Hähnchen dazu'},
    {time:'15:45 Pre-Workout', name:'Skyr & Nüsse', kcal:'~600 kcal', items:'250 g Skyr · 30 g Nüsse · Banane · 1 EL Honig · etwas früher, da Nüsse langsamer verdauen'},
    {time:'18:00 Training', name:'Zirkeltraining · Physio Loft', kcal:'', items:'~45-60 Min · Wasserflasche mitnehmen', marker:true},
    {time:'19:45 Nach Training', name:'Protein-Mahlzeit', kcal:'~300 kcal', items:'Shake oder Quark, binnen 1-2h nach Training'},
    {time:'21:00 Abend', name:'Omelett', kcal:'~480 kcal', items:'4 Eier · 80 g Feta · Spinat · Tomaten · 1 Scheibe Vollkornbrot'},
  ]},
  5: { day:'Fr', meals:[
    {time:'9:30 Frühstück', name:'Rührei & Brot', kcal:'~420 kcal', items:'3 Eier · 1-2 Scheiben Vollkornbrot · Tomate'},
    {time:'12:00 Mittag', name:'Chicken Wrap', kcal:'~560 kcal', items:'2 Tortillas · 150 g Hähnchen · Salat · Möhren · Joghurt-Dip'},
    {time:'Snacks Vorm.+Nachm.', name:'Quark & Reiswaffeln', kcal:'~750 kcal', items:'250 g Magerquark · 3 Reiswaffeln mit Erdnussmus · Banane'},
    {time:'19:00 Abend', name:'Lachs/Forelle', kcal:'~500 kcal', items:'200 g Fisch · Brokkoli · 80 g Vollkornnudeln · Zitrone'},
  ]},
  6: { day:'Sa', meals:[
    {time:'8:30 Vor dem Lauf', name:'Oats & Banane', kcal:'~450 kcal', items:'60 g Haferflocken · 200 ml Milch · Banane · Erdnussmus'},
    {time:'13:00 Nach dem Lauf', name:'Großes Mittag', kcal:'~700 kcal', items:'250 g Hähnchen/Steak · 200 g Kartoffeln · Salat'},
    {time:'16:30 Snack', name:'Skyr-Bowl', kcal:'~650 kcal', items:'250 g Skyr · 40 g Granola · Banane · 20 g Erdnussmus'},
    {time:'19:00 Abend', name:'Leichter Abend', kcal:'~450 kcal', items:'200 g Magerquark · Gemüse-Sticks'},
  ]},
  0: { day:'So', meals:[
    {time:'10:00 Frühstück', name:'Sonntagsfrühstück', kcal:'~500 kcal', items:'3 Eier Spiegelei · 2 Scheiben Vollkornbrot · ½ Avocado'},
    {time:'13:00 Mittag', name:'Flexibel', kcal:'~600 kcal', items:'Protein + Gemüse priorisieren, auch Restaurant ok'},
    {time:'16:30 Snack', name:'Quark-Bowl', kcal:'~700 kcal', items:'250 g Magerquark · 40 g Haferflocken · Banane · 30 g Nüsse'},
    {time:'18:30 Abend', name:'Meal Prep Kochen', kcal:'~450 kcal', items:'Reis, Hähnchen, Gemüse für Mo-Mi vorkochen'},
  ]}
};

// ===== ERNÄHRUNG PRO PHASE =====
// Richtwerte für Alex (86 kg, aktiv). Der Wochen-Essensplan (FOOD_PLAN) bleibt die
// konkrete Basis; diese Profile sagen je nach Trainingsbelastung, was angepasst
// gehört (Kalorien, Carbs, Timing). Werte sind Orientierung, kein Dogma.
const PHASE_NUTRITION = {
  base: {
    focus: 'Recomp: Muskeln aufbauen & Bauchfett reduzieren',
    kcal: '~2200–2400 kcal/Tag (leichtes Defizit)',
    protein: 'sehr hoch: ~180 g (schützt Muskeln im Defizit)',
    carbs: 'moderat: ~200–250 g, v.a. um die Krafteinheiten',
    tips: [
      'Leichtes Defizit – langsam abnehmen, Kraft halten',
      'Protein auf jede Mahlzeit priorisieren',
      'Kreatin täglich (3–5 g)',
      'Fett geht überall weg, nicht nur am Bauch – dranbleiben',
    ]
  },
  build: {
    focus: 'Mehr Volumen & Ausdauer – der Tank muss voller sein',
    kcal: '~2900–3100 kcal/Tag',
    protein: 'halten: ~170 g',
    carbs: 'hoch: ~350–400 g, rund um Brick- & Laufeinheiten',
    tips: [
      'Vor dem Brick-Workout (Mi): Banane oder Reiswaffeln',
      'Nach harten Einheiten: Carbs + Protein binnen 1 h',
      'Mehr trinken – bei langen Läufen Elektrolyte',
    ]
  },
  specific: {
    focus: 'Hohe Intensität & Simulationen – Recovery + Carb-Timing',
    kcal: '~2900–3100 kcal/Tag',
    protein: 'halten: ~170 g',
    carbs: 'hoch & getimt: ~400 g, Schwerpunkt um die Simulationen',
    tips: [
      'Vor der Simulation (Sa): carb-reiches Frühstück 2–3 h vorher',
      'Während langer Einheiten: Carb-Gel/Getränk testen (Wettkampf-Probe!)',
      'Recovery priorisieren: Schlaf + Protein vor dem Schlafen',
    ]
  },
  taper: {
    focus: 'Volumen runter – frisch & leicht ins Rennen, voller Glykogenspeicher',
    kcal: '~2400–2600 kcal/Tag (du verbrennst weniger)',
    protein: 'halten: ~170 g (Muskeln schützen)',
    carbs: 'hoch halten, letzte 2–3 Tage Carb-Loading (~7–8 g/kg)',
    tips: [
      'Kalorien leicht senken – weniger Training',
      'Carb-Loading 2–3 Tage vor Frankfurt',
      'Am Renntag nichts Neues essen – nur Bewährtes!',
      'Elektrolyte/Salz am Vortag beachten',
    ]
  }
};

const SHOP_LIST = {
  1: [
    {cat:'Protein', items:['Hähnchenbrust 1,5 kg','Lachs/Forelle 600 g','Mageres Rinderhack 500 g','Putenhack 500 g','Eier 18 Stück','Thunfisch Dosen × 4','Whey Protein Pulver']},
    {cat:'Milchprodukte', items:['Magerquark 1 kg','Skyr 2 Becher','Griech. Joghurt 0% 1 kg','Hüttenkäse 500 g','Feta 200 g','Milch 1,5% 1 Liter']},
    {cat:'Kohlenhydrate', items:['Haferflocken 1 kg','Vollkornreis 1 kg','Süßkartoffeln 1 kg','Vollkornbrot','Reiswaffeln','Vollkornnudeln 500 g','Quinoa 500 g','Tortillas']},
    {cat:'Gemüse', items:['Brokkoli (TK) 1 kg','Paprika 4 Stück','Gurke 2 Stück','Blattspinat (TK) 450 g','Möhren 500 g','Tomaten']},
    {cat:'Obst & Sonstiges', items:['Bananen 8-10 Stück','Beeren','Äpfel 4-5 Stück','Avocado 2 Stück','Erdnussmus','Nüsse (gemischt) 300 g','Granola','Chia-Samen','Creatine Monohydrat']},
  ],
  2: [
    {cat:'Protein', items:['Hähnchenbrust 1,5 kg','Putenhack 500 g','Lachs 400 g','Eier 12 Stück','Thunfisch Dosen × 4']},
    {cat:'Milchprodukte', items:['Magerquark 1 kg','Skyr 2 Becher','Hüttenkäse 500 g','Griech. Joghurt 0% 500 g']},
    {cat:'Kohlenhydrate', items:['Vollkornreis (auffüllen)','Kartoffeln 1 kg','Vollkornnudeln 500 g','Vollkornbrot (auffüllen)','Tortillas (auffüllen)']},
    {cat:'Gemüse', items:['Brokkoli (auffüllen)','Zucchini 2 Stück','Tomaten 500 g','Möhren (auffüllen)']},
    {cat:'Obst & Sonstiges', items:['Bananen 8-10 Stück','Avocado 2 Stück','Beeren (auffüllen)','Nüsse (gemischt) 300 g','Erdnussmus (prüfen)','Creatine prüfen']},
  ]
};

// ===== EINKAUF PRO PHASE =====
// Zusatz-Positionen, die je nach Trainingsphase oben drauf kommen. Werden an die
// Basis-Liste (SHOP_LIST) angehängt — gleiche Struktur {cat, items}.
// base = leer, da die Basis-Liste den Aufbau schon abdeckt.
const PHASE_SHOP = {
  base: [],
  build: [
    {cat:'Aufbau-Phase · extra Carbs & Energie', items:['Haferflocken Nachschub','Reiswaffeln 2 Pck','Bananen +10','Honig','Vollkornreis +500 g','Elektrolyte/iso (für lange Läufe)']},
  ],
  specific: [
    {cat:'Spezifisch-Phase · Carb-Timing & Wettkampf-Test', items:['Energy-Gels (zum Testen)','Isotonisches Getränkepulver','Weißer Reis (schnelle Carbs)','Bananen +10','Salz / Elektrolyte']},
  ],
  taper: [
    {cat:'Taper · Carb-Loading vor dem Rennen', items:['Reis / Pasta reichlich','Kartoffeln 1 kg','Weißbrot / Bagels','Bananen','Honig / Marmelade','Salz / Elektrolyte','bewährte Snacks (nichts Neues!)']},
  ]
};

// ===== STATE =====
const STORAGE_KEY = 'hyrox_app_state_v1';
let state = loadState();

function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(raw){
      // Defaults als Basis, gespeicherte Werte drüber → fehlende (neue) Keys
      // werden automatisch mit Defaults aufgefüllt.
      return Object.assign(defaultState(), JSON.parse(raw));
    }
  }catch(e){}
  return defaultState();
}
let saveWarned = false; // verhindert Alert-Spam bei wiederholtem Speicher-Fehler
function saveState(){
  try{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    saveWarned = false;
  }catch(e){
    if(!saveWarned){
      saveWarned = true;
      alert('Speichern fehlgeschlagen – dein Fortschritt landet gerade NICHT auf dem Gerät. Mach bitte ein Backup (Tab Verlauf → Export).');
    }
  }
}

// Escaped Nutzer-Text, bevor er per innerHTML eingesetzt wird (z.B. Tagesnotizen).
// Verhindert, dass < > & " ' das Markup zerschießen.
function escapeHtml(s){
  return String(s)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;');
}

// Löst einen Plan-Eintrag auf: bei 'choice'-Tagen wird die für dieses Datum
// gespeicherte Variante zurückgegeben (oder null, wenn noch keine gewählt wurde)
function resolvePlan(dow, dateKey){
  const entry = planEntry(dow, dateFromKey(dateKey));
  if(entry.type !== 'choice') return entry;
  const chosen = state.variantChoice[dateKey];
  if(!chosen) return null; // noch keine Wahl getroffen
  const variant = entry.variants[chosen];
  return { ...variant, dot: entry.dot };
}

// ===== HELPERS =====
// Wichtig: KEIN toISOString() verwenden — das rechnet auf UTC um und verschiebt
// das Datum je nach Tageszeit/Zeitzone (z.B. abends in Deutschland) auf den
// falschen Kalendertag. Stattdessen lokale Werte direkt auslesen.
function todayKey(d){
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,'0');
  const day = String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${day}`;
}
// Umkehrung von todayKey: 'YYYY-MM-DD' -> lokales Date (kein UTC-Parsing wie
// new Date(str), das je nach Zeitzone einen Tag verschieben würde).
function dateFromKey(dk){
  const [y,m,d] = dk.split('-').map(Number);
  return new Date(y, m-1, d);
}
function getWeekDates(){
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((day+6)%7));
  const dates = [];
  for(let i=0;i<7;i++){
    const d = new Date(monday);
    d.setDate(monday.getDate()+i);
    dates.push(d);
  }
  return dates;
}
// Wochentag (JS getDay(): 0=So,1=Mo..6=Sa) -> dateKey des Tages in DIESER Woche.
// Damit kann der Essen-Tab (rendert nach Wochentag) die pro-Datum gespeicherte
// Trainingswahl aus state.variantChoice auslesen.
function dateKeyForDow(dow){
  const idx = (dow === 0) ? 6 : dow - 1; // Mo=Index0 ... So=Index6
  return todayKey(getWeekDates()[idx]);
}

let selectedDate = new Date();

// ===== GEWICHT-TRACKING =====
// Parst die Satzanzahl aus z.B. "4×10-12" oder "3×500m" -> 4 bzw. 3
function parseSetCount(setsText){
  const match = (setsText || '').match(/^(\d+)\s*×/);
  return match ? parseInt(match[1]) : 3; // Fallback: 3 Sätze
}

// Eindeutiger Schlüssel pro Übung (unabhängig vom Datum), damit der Verlauf
// über mehrere Wochen hinweg derselben Übung zugeordnet wird.
function exerciseWeightKey(phaseKey, dow, variantKey, exIndex){
  // 'base' bleibt OHNE Phasen-Segment, damit Gewichts-Einträge aus der Zeit vor
  // Einführung der Phasen weiterhin derselben Übung zugeordnet bleiben.
  const phaseSeg = (phaseKey && phaseKey !== 'base') ? phaseKey + '_' : '';
  return `w_${phaseSeg}${dow}${variantKey ? '_'+variantKey : ''}_${exIndex}`;
}

// Speichert einen neuen Gewichtseintrag (Array von Satzgewichten) mit Datum
function saveWeightEntry(wKey, dk, weights){
  if(!state.weights[wKey]) state.weights[wKey] = [];
  // bestehenden Eintrag für heute überschreiben falls vorhanden, sonst neu anhängen
  const existing = state.weights[wKey].findIndex(e=>e.date===dk);
  const entry = { date: dk, weights };
  if(existing>=0) state.weights[wKey][existing] = entry;
  else state.weights[wKey].push(entry);
  // nach Datum sortiert halten
  state.weights[wKey].sort((a,b)=> a.date.localeCompare(b.date));
  saveState();
}

function getWeightHistory(wKey, limit=3){
  const all = state.weights[wKey] || [];
  return all.slice(-limit).reverse(); // neuste zuerst
}


// ===== ANATOMIE-GRAFIK =====
// Muskel-Polygone (Vorder-/Rückansicht) aus "body-highlighter" von Arnaud Lahaxe,
// MIT-Lizenz (https://github.com/lahaxearnaud/body-highlighter). Koordinaten 1:1
// übernommen und auf die Muskel-Keys dieser App gemappt. key:null = neutrale
// Silhouette (Kopf/Knie), nicht einfärbbar.
const BODY_ANATOMY = {
  front: [
    { key:'chest', pts:[
      '51.8367347 41.6326531 51.0204082 55.1020408 57.9591837 57.9591837 67.755102 55.5102041 70.6122449 47.3469388 62.0408163 41.6326531',
      '29.7959184 46.5306122 31.4285714 55.5102041 40.8163265 57.9591837 48.1632653 55.1020408 47.755102 42.0408163 37.5510204 42.0408163' ] },
    { key:'obliques', pts:[
      '68.5714286 63.2653061 67.3469388 57.1428571 58.7755102 59.5918367 60 64.0816327 60.4081633 83.2653061 65.7142857 78.7755102 66.5306122 69.7959184',
      '33.877551 78.3673469 33.0612245 71.8367347 31.0204082 63.2653061 32.244898 57.1428571 40.8163265 59.1836735 39.1836735 63.2653061 39.1836735 83.6734694' ] },
    { key:'abs', pts:[
      '56.3265306 59.1836735 57.9591837 64.0816327 58.3673469 77.9591837 58.3673469 92.6530612 56.3265306 98.3673469 55.1020408 104.081633 51.4285714 107.755102 51.0204082 84.4897959 50.6122449 67.3469388 51.0204082 57.1428571',
      '43.6734694 58.7755102 48.5714286 57.1428571 48.9795918 67.3469388 48.5714286 84.4897959 48.1632653 107.346939 44.4897959 103.673469 40.8163265 91.4285714 40.8163265 78.3673469 41.2244898 64.4897959' ] },
    { key:'biceps', pts:[
      '16.7346939 68.1632653 17.9591837 71.4285714 22.8571429 66.122449 28.9795918 53.877551 27.755102 49.3877551 20.4081633 55.9183673',
      '71.4285714 49.3877551 70.2040816 54.6938776 76.3265306 66.122449 81.6326531 71.8367347 82.8571429 68.9795918 78.7755102 55.5102041' ] },
    { key:'triceps', pts:[
      '69.3877551 55.5102041 69.3877551 61.6326531 75.9183673 72.6530612 77.5510204 70.2040816 75.5102041 67.3469388',
      '22.4489796 69.3877551 29.7959184 55.5102041 29.7959184 60.8163265 22.8571429 73.0612245' ] },
    { key:'neck', pts:[
      '55.5102041 23.6734694 50.6122449 33.4693878 50.6122449 39.1836735 61.6326531 40 70.6122449 44.8979592 69.3877551 36.7346939 63.2653061 35.1020408 58.3673469 30.6122449',
      '28.9795918 44.8979592 30.2040816 37.1428571 36.3265306 35.1020408 41.2244898 30.2040816 44.4897959 24.4897959 48.9795918 33.877551 48.5714286 39.1836735 37.9591837 39.5918367' ] },
    { key:'shoulders', pts:[
      '78.3673469 53.0612245 79.5918367 47.755102 79.1836735 41.2244898 75.9183673 37.9591837 71.0204082 36.3265306 72.244898 42.8571429 71.4285714 47.3469388',
      '28.1632653 47.3469388 21.2244898 53.0612245 20 47.755102 20.4081633 40.8163265 24.4897959 37.1428571 28.5714286 37.1428571 26.9387755 43.2653061' ] },
    { key:null, pts:[
      '42.4489796 2.85714286 40 11.8367347 42.0408163 19.5918367 46.122449 23.2653061 49.7959184 25.3061224 54.6938776 22.4489796 57.5510204 19.1836735 59.1836735 10.2040816 57.1428571 2.44897959 49.7959184 0' ] },
    { key:'hips', pts:[
      '52.6530612 110.204082 54.2857143 124.897959 60 110.204082 62.0408163 100 64.8979592 94.2857143 60 92.6530612 56.7346939 104.489796',
      '47.755102 110.612245 44.8979592 125.306122 42.0408163 115.918367 40.4081633 113.061224 39.5918367 107.346939 37.9591837 102.44898 34.6938776 93.877551 39.5918367 92.244898 41.6326531 99.1836735 43.6734694 105.306122' ] },
    { key:'quads', pts:[
      '34.6938776 98.7755102 37.1428571 108.163265 37.1428571 127.755102 34.2857143 137.142857 31.0204082 132.653061 29.3877551 120 28.1632653 111.428571 29.3877551 100.816327 32.244898 94.6938776',
      '63.2653061 105.714286 64.4897959 100 66.9387755 94.6938776 70.2040816 101.22449 71.0204082 111.836735 68.1632653 133.061224 65.3061224 137.55102 62.4489796 128.571429 62.0408163 111.428571',
      '38.7755102 129.387755 38.3673469 112.244898 41.2244898 118.367347 44.4897959 129.387755 42.8571429 135.102041 40 146.122449 36.3265306 146.530612 35.5102041 140',
      '59.5918367 145.714286 55.5102041 128.979592 60.8163265 113.877551 61.2244898 130.204082 64.0816327 139.591837 62.8571429 146.530612',
      '32.6530612 138.367347 26.5306122 145.714286 25.7142857 136.734694 25.7142857 127.346939 26.9387755 114.285714 29.3877551 133.469388',
      '71.8367347 113.061224 73.877551 124.081633 73.877551 140.408163 72.6530612 145.714286 66.5306122 138.367347 70.2040816 133.469388' ] },
    { key:null, pts:[
      '33.877551 140 34.6938776 143.265306 35.5102041 147.346939 36.3265306 151.020408 35.1020408 156.734694 29.7959184 156.734694 27.3469388 152.653061 27.3469388 147.346939 30.2040816 144.081633',
      '65.7142857 140 72.244898 147.755102 72.244898 152.244898 69.7959184 157.142857 64.8979592 156.734694 62.8571429 151.020408' ] },
    { key:'calves', pts:[
      '71.4285714 160.408163 73.4693878 153.469388 76.7346939 161.22449 79.5918367 167.755102 78.3673469 187.755102 79.5918367 195.510204 74.6938776 195.510204',
      '24.8979592 194.693878 27.755102 164.897959 28.1632653 160.408163 26.122449 154.285714 24.8979592 157.55102 22.4489796 161.632653 20.8163265 167.755102 22.0408163 188.163265 20.8163265 195.510204',
      '72.6530612 195.102041 69.7959184 159.183673 65.3061224 158.367347 64.0816327 162.44898 64.0816327 165.306122 65.7142857 177.142857',
      '35.5102041 158.367347 35.9183673 162.44898 35.9183673 166.938776 35.1020408 172.244898 35.1020408 176.734694 32.244898 182.040816 30.6122449 187.346939 26.9387755 194.693878 27.3469388 187.755102 28.1632653 180.408163 28.5714286 175.510204 28.9795918 169.795918 29.7959184 164.081633 30.2040816 158.77551' ] },
    { key:'forearms', pts:[
      '6.12244898 88.5714286 10.2040816 75.1020408 14.6938776 70.2040816 16.3265306 74.2857143 19.1836735 73.4693878 4.48979592 97.5510204 0 100',
      '84.4897959 69.7959184 83.2653061 73.4693878 80 73.0612245 95.1020408 98.3673469 100 100.408163 93.4693878 89.3877551 89.7959184 76.3265306',
      '77.5510204 72.244898 77.5510204 77.5510204 80.4081633 84.0816327 85.3061224 89.7959184 92.244898 101.22449 94.6938776 99.5918367',
      '6.93877551 101.22449 13.4693878 90.6122449 18.7755102 84.0816327 21.6326531 77.1428571 21.2244898 71.8367347 4.89795918 98.7755102' ] },
  ],
  back: [
    { key:null, pts:[
      '50.6382979 0 45.9574468 0.85106383 40.8510638 5.53191489 40.4255319 12.7659574 45.106383 20 55.7446809 20 59.1489362 13.6170213 59.5744681 4.68085106 55.7446809 1.27659574' ] },
    { key:'traps', pts:[
      '44.6808511 21.7021277 47.6595745 21.7021277 47.2340426 38.2978723 47.6595745 64.6808511 38.2978723 53.1914894 35.3191489 40.8510638 31.0638298 36.5957447 39.1489362 33.1914894 43.8297872 27.2340426',
      '52.3404255 21.7021277 55.7446809 21.7021277 56.5957447 27.2340426 60.8510638 32.7659574 68.9361702 36.5957447 64.6808511 40.4255319 61.7021277 53.1914894 52.3404255 64.6808511 53.1914894 38.2978723' ] },
    { key:'shoulders', pts:[
      '29.3617021 37.0212766 22.9787234 39.1489362 17.4468085 44.2553191 18.2978723 53.6170213 24.2553191 49.3617021 27.2340426 46.3829787',
      '71.0638298 37.0212766 78.2978723 39.5744681 82.5531915 44.6808511 81.7021277 53.6170213 74.893617 48.9361702 72.3404255 45.106383' ] },
    { key:'lats', pts:[
      '31.0638298 38.7234043 28.0851064 48.9361702 28.5106383 55.3191489 34.0425532 75.3191489 47.2340426 71.0638298 47.2340426 66.3829787 36.5957447 54.0425532 33.6170213 41.2765957',
      '68.9361702 38.7234043 71.9148936 49.3617021 71.4893617 56.1702128 65.9574468 75.3191489 52.7659574 71.0638298 52.7659574 66.3829787 63.4042553 54.4680851 66.3829787 41.7021277' ] },
    { key:'triceps', pts:[
      '26.8085106 49.787234 17.8723404 55.7446809 14.4680851 72.3404255 16.5957447 81.7021277 21.7021277 63.8297872 26.8085106 55.7446809',
      '73.6170213 50.212766 82.1276596 55.7446809 85.9574468 73.1914894 83.4042553 82.1276596 77.8723404 62.9787234 73.1914894 55.7446809',
      '26.8085106 58.2978723 26.8085106 68.5106383 22.9787234 75.3191489 19.1489362 77.4468085 22.5531915 65.5319149',
      '72.7659574 58.2978723 77.0212766 64.6808511 80.4255319 77.4468085 76.5957447 75.3191489 72.7659574 68.9361702' ] },
    { key:'lowerback', pts:[
      '47.6595745 72.7659574 34.4680851 77.0212766 35.3191489 83.4042553 49.3617021 102.12766 46.8085106 82.9787234',
      '52.3404255 72.7659574 65.5319149 77.0212766 64.6808511 83.4042553 50.6382979 102.12766 53.1914894 83.8297872' ] },
    { key:'forearms', pts:[
      '86.3829787 75.7446809 91.0638298 83.4042553 93.1914894 94.0425532 100 106.382979 96.1702128 104.255319 88.0851064 89.3617021 84.2553191 83.8297872',
      '13.6170213 75.7446809 8.93617021 83.8297872 6.80851064 93.6170213 0 106.382979 3.82978723 104.255319 12.3404255 88.5106383 15.7446809 82.9787234',
      '81.2765957 79.5744681 77.4468085 77.8723404 79.1489362 84.6808511 91.0638298 103.829787 93.1914894 108.93617 94.4680851 104.680851',
      '18.7234043 79.5744681 22.1276596 77.8723404 20.8510638 84.2553191 9.36170213 102.978723 6.80851064 108.510638 5.10638298 104.680851' ] },
    { key:'glutes', pts:[
      '44.6808511 99.5744681 30.212766 108.510638 29.787234 118.723404 31.4893617 125.957447 47.2340426 121.276596 49.3617021 114.893617',
      '55.3191489 99.1489362 51.0638298 114.468085 52.3404255 120.851064 68.0851064 125.957447 69.787234 119.148936 69.3617021 108.510638' ] },
    { key:'hips', pts:[
      '48.0851064 122.978723 44.6808511 122.978723 41.2765957 125.531915 45.106383 144.255319 48.5106383 135.744681 48.9361702 129.361702',
      '51.9148936 122.553191 55.7446809 123.404255 59.1489362 125.957447 54.893617 144.255319 51.9148936 136.170213 51.0638298 129.361702' ] },
    { key:'hamstrings', pts:[
      '28.9361702 122.12766 31.0638298 129.361702 36.5957447 125.957447 35.3191489 135.319149 34.4680851 150.212766 29.3617021 158.297872 28.9361702 146.808511 27.6595745 141.276596 27.2340426 131.489362',
      '71.4893617 121.702128 69.3617021 128.93617 63.8297872 125.957447 65.5319149 136.595745 66.3829787 150.212766 71.0638298 158.297872 71.4893617 147.659574 72.7659574 142.12766 73.6170213 131.914894',
      '38.7234043 125.531915 44.2553191 145.957447 40.4255319 166.808511 36.1702128 152.765957 37.0212766 135.319149',
      '61.7021277 125.531915 63.4042553 136.170213 64.2553191 153.191489 60 166.808511 56.1702128 146.382979' ] },
    { key:null, pts:[
      '34.4680851 153.191489 31.0638298 159.148936 33.6170213 166.382979 37.4468085 162.553191',
      '66.3829787 153.617021 62.9787234 162.978723 66.8085106 166.382979 69.3617021 159.148936' ] },
    { key:'calves', pts:[
      '29.3617021 160.425532 28.5106383 167.234043 24.6808511 179.574468 23.8297872 192.765957 25.5319149 197.021277 28.5106383 193.191489 29.787234 180 31.9148936 171.06383 31.9148936 166.808511',
      '37.4468085 165.106383 35.3191489 167.659574 33.1914894 171.914894 31.0638298 180.425532 30.212766 191.914894 34.0425532 200 38.7234043 190.638298 39.1489362 168.93617',
      '62.9787234 165.106383 61.2765957 168.510638 61.7021277 190.638298 66.3829787 199.574468 70.6382979 191.914894 68.9361702 179.574468 66.8085106 170.212766',
      '70.6382979 160.425532 72.3404255 168.510638 75.7446809 179.148936 76.5957447 192.765957 74.4680851 196.595745 72.3404255 193.617021 70.6382979 179.574468 68.0851064 168.085106',
      '28.5106383 195.744681 30.212766 195.744681 33.6170213 201.702128 30.6382979 220 28.5106383 213.617021 26.8085106 198.297872',
      '69.787234 195.744681 71.9148936 195.744681 73.6170213 198.297872 71.9148936 213.191489 70.212766 219.574468 67.2340426 202.12766' ] },
  ]
};

// Zeichnet beide Körperansichten; aktive Muskeln werden hervorgehoben.
function renderBodySvg(activeMuscles){
  const isActive = (key) => key && activeMuscles.includes(key);
  const fillFor = (key) => key === null ? 'var(--muscle-base)'
    : (isActive(key) ? 'var(--muscle-active)' : 'var(--muscle-inactive)');
  const draw = (regions) => regions.map(r =>
    r.pts.map(p => `<polygon points="${p}" fill="${fillFor(r.key)}" stroke="var(--card)" stroke-width="0.5"/>`).join('')
  ).join('');
  const front = `<svg viewBox="0 0 100 222" xmlns="http://www.w3.org/2000/svg">${draw(BODY_ANATOMY.front)}</svg>`;
  const back = `<svg viewBox="0 0 100 222" xmlns="http://www.w3.org/2000/svg">${draw(BODY_ANATOMY.back)}</svg>`;

  return `
    <div class="body-figures">
      <div class="body-figure">
        ${front}
        <div class="body-figure-label">Vorne</div>
      </div>
      <div class="body-figure">
        ${back}
        <div class="body-figure-label">Hinten</div>
      </div>
    </div>
    <div class="muscle-tags">
      ${activeMuscles.map(key => `<span class="muscle-tag">${MUSCLE_INFO[key]?.label || key}</span>`).join('')}
    </div>
  `;
}


function renderCountdown(){
  const now = new Date();
  const diff = Math.ceil((getHyroxDate() - now) / (1000*60*60*24));
  document.getElementById('countdown').innerHTML = `<b>${diff}</b> Tage<br>bis Frankfurt`;
}

// Deload-Hinweis für einen Trainingstag (leer bei Ruhetag oder Nicht-Deload-Woche).
function deloadNoteHtml(d, type){
  if(type==='ruhe' || !isDeloadWeek(d)) return '';
  return `<div class="deload-note">⬇ <b>Deload-Woche:</b> Volumen ~−40 % – Gewichte/Runden reduzieren, sauber & locker bleiben, gut erholen.</div>`;
}

// ===== RENDER: PHASEN-BANNER (Heute) =====
function renderPhaseBanner(){
  const el = document.getElementById('phaseBanner');
  if(!el) return;
  const now = new Date();
  const phase = phaseForDate(now);
  const weeks = Math.max(0, weeksUntilRace(now));
  el.innerHTML = `
    <div class="pb-badge">${phase.label}</div>
    <div class="pb-text">
      <div class="pb-title">Aktuelle Phase: ${phase.label}</div>
      <div class="pb-sub">${phase.blurb} · noch ${weeks} Wochen</div>
    </div>
    ${isDeloadWeek(now) ? `<div class="pb-deload">⬇ Deload-Woche</div>` : ''}
  `;
}

// ===== RENDER: PHASEN-ROADMAP (Verlauf) =====
function renderPhaseRoadmap(){
  const el = document.getElementById('phaseRoadmap');
  if(!el) return;
  const currentIdx = PHASES.indexOf(phaseForDate(new Date()));
  el.innerHTML = PHASES.map((p,i)=>{
    const cls = i < currentIdx ? 'done' : (i === currentIdx ? 'active' : '');
    let when;
    if(i === 0) when = `bis ${p.minWeeks} Wochen vor dem Rennen`;
    else if(p.minWeeks <= 0) when = 'letzte Wochen vor dem Rennen';
    else when = `${PHASES[i-1].minWeeks}–${p.minWeeks} Wochen vorher`;
    const n = PHASE_NUTRITION[p.key];
    const extra = PHASE_SHOP[p.key];
    const shopSub = (extra && extra.length) ? extra[0].cat : 'keine Extras (Basis-Einkauf)';
    return `
      <div class="phase-step ${cls}" data-i="${i}">
        <div class="ps-dot"></div>
        <div class="ps-main">
          <div class="ps-name">${i+1}. ${p.label} <span class="ps-toggle">ansehen ›</span></div>
          <div class="ps-blurb">${p.blurb}</div>
          <div class="ps-when">${when}</div>
          <div class="ps-detail" id="psd_${i}">
            <div class="ps-detail-head">Training</div>
            <ul class="ps-list">${p.highlights.map(h=>`<li>${h}</li>`).join('')}</ul>
            <div class="ps-detail-head">Ernährung</div>
            <div class="ps-detail-text">${n.focus} · ${n.kcal}</div>
            <div class="ps-detail-head">Einkauf</div>
            <div class="ps-detail-text">${shopSub}</div>
          </div>
        </div>
      </div>
    `;
  }).join('');
  el.querySelectorAll('.phase-step').forEach(step=>{
    step.onclick = ()=>{
      const panel = document.getElementById(`psd_${step.dataset.i}`);
      const isOpen = panel.classList.contains('open');
      el.querySelectorAll('.ps-detail.open').forEach(p=>p.classList.remove('open'));
      el.querySelectorAll('.phase-step.expanded').forEach(s=>s.classList.remove('expanded'));
      if(!isOpen){ panel.classList.add('open'); step.classList.add('expanded'); }
    };
  });
}

// ===== RENDER: KÖRPERGEWICHT =====
// Speichert das heutige Körpergewicht (überschreibt denselben Tag) und hält sortiert.
function addBodyWeight(kg){
  const dk = todayKey(new Date());
  const i = state.bodyWeights.findIndex(e=>e.date===dk);
  if(i>=0) state.bodyWeights[i].kg = kg;
  else state.bodyWeights.push({ date:dk, kg });
  state.bodyWeights.sort((a,b)=> a.date.localeCompare(b.date));
  saveState();
}
function renderBodyWeight(){
  const el = document.getElementById('bodyWeightSection');
  if(!el) return;
  const all = state.bodyWeights;
  const latest = all[all.length-1];
  const prev = all[all.length-2];
  const delta = (latest && prev) ? (latest.kg - prev.kg) : null;
  // Mini-Sparkline aus dem Verlauf
  let spark = '';
  if(all.length >= 2){
    const kgs = all.map(e=>e.kg);
    const min = Math.min(...kgs), max = Math.max(...kgs), range = (max-min) || 1;
    const W=280, H=44, pad=5;
    const pts = all.map((e,idx)=>{
      const x = pad + idx*(W-2*pad)/(all.length-1);
      const y = pad + (1-(e.kg-min)/range)*(H-2*pad);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
    spark = `<svg class="bw-spark" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><polyline points="${pts}" fill="none" stroke="var(--moss)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }
  el.innerHTML = `
    <div class="bw-card">
      <div class="bw-row">
        <input type="number" inputmode="decimal" id="bwInput" class="weight-input" placeholder="${latest?latest.kg:'kg'}" step="0.1">
        <button class="bw-save" id="bwSave">Eintragen</button>
      </div>
      ${latest
        ? `<div class="bw-current">Aktuell <b>${latest.kg} kg</b>${delta!==null?` <span class="bw-delta ${delta<=0?'down':'up'}">${delta>0?'+':''}${delta.toFixed(1)} kg</span>`:''}</div>`
        : `<div class="bw-current" style="color:var(--ink-faint)">Noch kein Gewicht eingetragen</div>`}
      ${spark}
      ${all.length ? `<div class="bw-list">${all.slice(-6).reverse().map(e=>{
        const d = dateFromKey(e.date);
        return `<div class="bw-item"><span>${d.toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit'})}</span><span>${e.kg} kg</span></div>`;
      }).join('')}</div>` : ''}
    </div>
  `;
  document.getElementById('bwSave').onclick = ()=>{
    const v = parseFloat(document.getElementById('bwInput').value);
    if(!isNaN(v) && v>0 && v<400){ addBodyWeight(v); renderBodyWeight(); }
  };
}

// ===== RENDER: BESTZEITEN (PRs) =====
const PR_FIELDS = [
  { key:'run1k',    label:'1 km Lauf',              ph:'min:sek' },
  { key:'ski1k',    label:'SkiErg 1000 m',          ph:'min:sek' },
  { key:'sledpush', label:'Sled Push 50 m',         ph:'min:sek' },
  { key:'sledpull', label:'Sled Pull 50 m',         ph:'min:sek' },
  { key:'burpees',  label:'Burpee Broad Jumps 80 m', ph:'min:sek' },
  { key:'row1k',    label:'Rowing 1000 m',          ph:'min:sek' },
  { key:'farmers',  label:'Farmers Carry 200 m',    ph:'min:sek' },
  { key:'lunges',   label:'Sandbag Lunges 100 m',   ph:'min:sek' },
  { key:'wallballs',label:'Wall Balls (100)',       ph:'min:sek' },
  { key:'fullrace', label:'Hyrox gesamt',           ph:'h:min:sek' },
];
// Wandelt eine Zeit-/Ergebnis-Eingabe in eine Zahl: "3:45"→225, "1:05:30"→3930,
// "100 Wdh"→100, "0:48"→48. Für den Trend-Chart. Gibt null bei nicht-parsebar.
function parseMetric(v){
  if(v==null) return null;
  const s = String(v).trim();
  if(/^\d+(:\d{1,2})+$/.test(s)) return s.split(':').reduce((a,p)=> a*60+parseInt(p,10), 0);
  const m = s.match(/[\d.,]+/);
  return m ? parseFloat(m[0].replace(',','.')) : null;
}
// Mini-Sparkline aus der Perf-Testhistorie einer Disziplin (chronologisch).
// Höherer Wert = oben → bei Zeiten heißt eine fallende Linie „schneller geworden".
function prTrendHtml(discKey){
  const all = (state.perf[discKey] || []).map(e=>parseMetric(e.value)).filter(v=>v!=null && !isNaN(v));
  if(all.length < 2) return '';
  const min = Math.min(...all), max = Math.max(...all), range = (max-min) || 1;
  const W=240, H=34, pad=4;
  const pts = all.map((v,idx)=>{
    const x = pad + idx*(W-2*pad)/(all.length-1);
    const y = pad + (1-(v-min)/range)*(H-2*pad);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  const delta = all[all.length-1] - all[0];           // <0 = Wert gesunken (Zeit: schneller)
  const trend = delta < 0 ? `<span class="pr-trend better">▼ schneller</span>`
              : delta > 0 ? `<span class="pr-trend worse">▲ langsamer</span>` : '';
  return `<div class="pr-trend-row">
    <svg class="pr-spark" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><polyline points="${pts}" fill="none" stroke="var(--steel)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    <div class="pr-trend-meta">${all.length} Tests${trend}</div>
  </div>`;
}
function renderPRs(){
  const el = document.getElementById('prSection');
  if(!el) return;
  el.innerHTML = `<div class="pr-card">${PR_FIELDS.map(f=>`
    <div class="pr-item">
      <div class="pr-head">
        <span class="pr-label">${f.label}</span>
        <input type="text" class="pr-input" data-key="${f.key}" value="${state.prs[f.key] || ''}" placeholder="${f.ph}">
      </div>
      ${prTrendHtml(f.key)}
    </div>
  `).join('')}</div>`;
  el.querySelectorAll('.pr-input').forEach(inp=>{
    inp.oninput = ()=>{
      const v = inp.value.trim();
      if(v) state.prs[inp.dataset.key] = v; else delete state.prs[inp.dataset.key];
      saveState();
    };
  });
}

// ===== RENDER: PROFIL =====
// Pro-Person-Einstellungen (eigener localStorage je Gerät): Name, Gewicht,
// Kalorienziel (skaliert die Essensplan-Anzeige) und Einstiegsphase.
function renderProfile(){
  const el = document.getElementById('profileSection');
  if(!el) return;
  const p = state.profile || {};
  const phaseOpts = [
    {k:'base',     label:'Grundaufbau (Standard)'},
    {k:'build',    label:'Aufbau'},
    {k:'specific', label:'Spezifisch'},
  ];
  el.innerHTML = `
    <div class="profile-card">
      <div class="profile-row">
        <span class="profile-label">Name</span>
        <input class="profile-input" id="profileName" type="text" maxlength="24"
               placeholder="optional" value="${escapeHtml(p.name || '')}">
      </div>
      <div class="profile-row">
        <span class="profile-label">Körpergewicht</span>
        <input class="profile-input" id="profileWeight" type="number" inputmode="decimal" min="30" max="300"
               placeholder="kg" value="${p.weightKg != null ? p.weightKg : ''}">
      </div>
      <div class="profile-row">
        <span class="profile-label">Kalorienziel</span>
        <input class="profile-input" id="profileKcal" type="number" inputmode="numeric" min="1000" max="5000"
               placeholder="kcal/Tag" value="${p.kcalTarget != null ? p.kcalTarget : ''}">
      </div>
      <div class="profile-row profile-col">
        <span class="profile-label">Einstieg ab Phase</span>
        <select class="profile-select" id="profileStartPhase">
          ${phaseOpts.map(o=>`<option value="${o.k}" ${(p.startPhase || 'base')===o.k ? 'selected' : ''}>${o.label}</option>`).join('')}
        </select>
        <span class="profile-hint">Phasen zu überspringen setzt entsprechende Trainingserfahrung voraus.</span>
      </div>
    </div>
  `;
  // Name: oninput (kein Re-Render → Fokus bleibt), nur speichern.
  document.getElementById('profileName').oninput = (e)=>{ state.profile.name = e.target.value; saveState(); };
  // Gewicht: speichern (leeres/ungültiges Feld → null).
  document.getElementById('profileWeight').onchange = (e)=>{
    const v = parseFloat(e.target.value);
    state.profile.weightKg = (isFinite(v) && v > 0) ? v : null;
    saveState();
  };
  // Kalorienziel: speichern + Essensplan-Anzeige neu skalieren.
  document.getElementById('profileKcal').onchange = (e)=>{
    const v = parseInt(e.target.value);
    state.profile.kcalTarget = (isFinite(v) && v > 0) ? v : null;
    saveState();
    renderFoodTabs();
  };
  // Einstiegsphase: speichern + alles Phasenabhängige neu (Heute/Banner/Ernährung/Einkauf).
  document.getElementById('profileStartPhase').onchange = (e)=>{
    state.profile.startPhase = e.target.value;
    saveState();
    renderAll();
  };
}

// ===== RENDER: BACKUP-ERINNERUNG =====
// Ab so vielen Tagen ohne Backup wird gewarnt (Text rot + Punkt am Verlauf-Tab).
const BACKUP_STALE_DAYS = 10;
function renderBackupHint(){
  // Tage seit letztem Backup (null = noch nie gesichert)
  const days = state.lastBackup
    ? Math.floor((new Date() - dateFromKey(state.lastBackup)) / (24*60*60*1000))
    : null;
  const stale = (days === null) || (days >= BACKUP_STALE_DAYS);

  // Punkt am Verlauf-Tab – läuft unabhängig vom Hinweis-Text, also aus jedem Tab.
  const badge = document.getElementById('backupBadge');
  if(badge) badge.classList.toggle('show', stale);

  // Text-Hinweis im Verlauf-Tab selbst.
  const el = document.getElementById('backupHint');
  if(!el) return;
  if(days === null){
    el.textContent = 'Noch kein Backup erstellt – exportier zur Sicherheit eins.';
    el.className = 'backup-hint warn';
    return;
  }
  const txt = days<=0 ? 'heute' : (days===1 ? 'vor 1 Tag' : `vor ${days} Tagen`);
  el.textContent = `Letztes Backup: ${txt}`;
  el.className = 'backup-hint' + (stale ? ' warn' : '');
}

// ===== RENDER: HYROX-WETTKAMPF (offizielle Referenz) =====
function renderHyroxInfo(){
  const el = document.getElementById('hyroxInfo');
  if(!el) return;
  const isDefault = !state.hyroxDate || state.hyroxDate === DEFAULT_HYROX_DATE;
  el.innerHTML = `
    <div class="hyrox-card">
      <div class="race-date-row">
        <div class="race-date-text">
          <span class="race-date-label">Renndatum</span>
          ${isDefault ? `<span class="race-date-hint">Platzhalter – sobald angemeldet, hier das echte Datum setzen</span>` : ''}
        </div>
        <input type="date" id="raceDateInput" class="race-date-input" value="${state.hyroxDate || DEFAULT_HYROX_DATE}">
      </div>
      <div class="hyrox-meta">${HYROX_RACE.division}<br>${HYROX_RACE.run}</div>
      <div class="hyrox-rows">
        ${HYROX_RACE.stations.map((s,i)=>`
          <div class="hyrox-row">
            <span class="hyrox-num">${i+1}</span>
            <span class="hyrox-name">${s.n}</span>
            <span class="hyrox-dist">${s.d}</span>
            <span class="hyrox-weight">${s.w}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  const inp = document.getElementById('raceDateInput');
  inp.onchange = ()=>{
    if(!inp.value) return;
    state.hyroxDate = inp.value;
    saveState();
    renderAll(); // Countdown, Phasen-Banner/-Roadmap, Heute/Woche etc. neu berechnen
  };
}

// ===== RENDER: STREAK STRIP (last 14 days) =====
function renderStreak(){
  const el = document.getElementById('streakStrip');
  el.innerHTML = '';
  const now = new Date();
  for(let i=13;i>=0;i--){
    const d = new Date(now);
    d.setDate(now.getDate()-i);
    const k = todayKey(d);
    const div = document.createElement('div');
    div.className = 'streak-day' + (state.completedDays[k] ? ' done':'') + (i===0?' today':'');
    el.appendChild(div);
  }
}

// ===== RENDER: TODAY CARD =====
function renderToday(){
  const now = new Date();
  const dow = now.getDay();
  const dk = todayKey(now);
  const entry = planEntry(dow, now);
  const card = document.getElementById('todayCard');

  if(entry.type === 'choice'){
    const plan = resolvePlan(dow, dk);
    if(!plan){
      card.innerHTML = renderChoicePicker(dow, dk, 'today');
      bindChoicePicker(dow, dk, 'today');
      return;
    }
    card.innerHTML = `
      <div class="today-card type-${plan.type}">
        <div class="today-label">${WEEKDAYS_FULL[dow]} · ${plan.label}</div>
        <div class="today-title">${plan.title}</div>
        <div class="today-sub">${plan.sub}</div>
        <div class="pill-row">
          ${plan.pills.map(p=>`<span class="pill pill-${entry.dot}">${p}</span>`).join('')}
        </div>
        ${deloadNoteHtml(now, plan.type)}
        <a class="change-choice" data-dow="${dow}" data-dk="${dk}" data-target="today">Training wechseln</a>
      </div>
    `;
    card.querySelector('.change-choice').onclick = ()=>{
      delete state.variantChoice[dk];
      saveState();
      renderToday();
    };
    return;
  }

  const plan = entry;
  card.innerHTML = `
    <div class="today-card type-${plan.type}">
      <div class="today-label">${WEEKDAYS_FULL[dow]} · ${plan.label}</div>
      <div class="today-title">${plan.title}</div>
      <div class="today-sub">${plan.sub}</div>
      <div class="pill-row">
        ${plan.pills.map(p=>`<span class="pill pill-${plan.dot}">${p}</span>`).join('')}
      </div>
      ${deloadNoteHtml(now, plan.type)}
    </div>
  `;
}

// Baut die "Welches Training heute?"-Auswahlkarte für choice-Tage
function renderChoicePicker(dow, dk, ctx){
  const entry = planEntry(dow, dateFromKey(dk));
  const opts = Object.keys(entry.variants);
  return `
    <div class="today-card type-choice">
      <div class="today-label">${WEEKDAYS_FULL[dow]} · ${entry.label}</div>
      <div class="today-title">Was steht heute an?</div>
      <div class="today-sub">Fährst du zum Zirkeltraining, oder gehst du normal ins Gym?</div>
      <div class="choice-row" data-dow="${dow}" data-dk="${dk}" data-ctx="${ctx}">
        ${opts.map(key=>{
          const v = entry.variants[key];
          return `<button class="choice-btn" data-key="${key}">${v.title}</button>`;
        }).join('')}
      </div>
    </div>
  `;
}

function bindChoicePicker(dow, dk, ctx){
  const row = document.querySelector(`.choice-row[data-dk="${dk}"][data-ctx="${ctx}"]`);
  if(!row) return;
  row.querySelectorAll('.choice-btn').forEach(btn=>{
    btn.onclick = ()=>{
      state.variantChoice[dk] = btn.dataset.key;
      saveState();
      if(ctx==='today') renderToday();
      else { renderDayDetail(); }
    };
  });
}

// ===== RENDER: WEEK GRID + DAY DETAIL =====
function renderWeek(){
  const grid = document.getElementById('weekGrid');
  const dates = getWeekDates();
  grid.innerHTML = '';
  dates.forEach(d=>{
    const dow = d.getDay();
    const entry = planEntry(dow, d);
    const isSelected = todayKey(d) === todayKey(selectedDate);
    const chip = document.createElement('div');
    chip.className = 'day-chip' + (isSelected ? ' active':'');
    chip.innerHTML = `<div class="dn">${WEEKDAYS[dow]}</div><div class="dd ${entry.dot}"></div>`;
    chip.onclick = ()=>{
      selectedDate = d;
      grid.querySelectorAll('.day-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      renderDayDetail();
    };
    grid.appendChild(chip);
  });
}

function renderDayDetail(){
  const dow = selectedDate.getDay();
  const entry = planEntry(dow, selectedDate);
  const dk = todayKey(selectedDate);
  const el = document.getElementById('dayDetail');

  if(entry.type === 'choice'){
    const plan = resolvePlan(dow, dk);
    if(!plan){
      el.innerHTML = renderChoicePickerDetail(dow, dk);
      bindChoicePicker(dow, dk, 'detail');
      return;
    }
    const variantKey = state.variantChoice[dk];
    renderDayDetailContent(plan, dow, dk, true, variantKey);
    return;
  }

  renderDayDetailContent(entry, dow, dk, false, null);
}

// Auswahlkarte im "Diese Woche"-Detailbereich (eigenständig, kein String-Hacking)
function renderChoicePickerDetail(dow, dk){
  const entry = planEntry(dow, dateFromKey(dk));
  const opts = Object.keys(entry.variants);
  return `
    <div class="day-detail">
      <div class="day-detail-title">Was steht an diesem Tag an?</div>
      <div class="day-detail-sub">${WEEKDAYS_FULL[dow]} · Zirkeltraining oder normales Gym?</div>
      <div class="choice-row" data-dow="${dow}" data-dk="${dk}" data-ctx="detail">
        ${opts.map(key=>{
          const v = entry.variants[key];
          return `<button class="choice-btn" data-key="${key}">${v.title}</button>`;
        }).join('')}
      </div>
    </div>
  `;
}

function renderDayDetailContent(plan, dow, dk, isChoice, variantKey){
  const el = document.getElementById('dayDetail');
  const phaseKey = phaseForDate(dateFromKey(dk)).key;
  el.innerHTML = `
    <div class="day-detail">
      <div class="day-detail-title">${plan.title}</div>
      <div class="day-detail-sub">${WEEKDAYS_FULL[dow]} · ${plan.sub}</div>
      ${deloadNoteHtml(dateFromKey(dk), plan.type)}
      <div class="exercise-list">
        ${plan.exercises.map((ex,i)=>{
          const k = `${dk}_${i}`;
          const checked = !!state.exercises[k];
          const isHeader = ex.n.startsWith('—');
          if(isHeader){
            return `<div class="exercise-divider">${ex.n}</div>`;
          }
          const hasMuscles = ex.m && ex.m.length;
          // Hyrox-Disziplinen (ex.perf) tracken Zeit/Ergebnis statt Satzgewichte.
          const isMachine = !ex.perf && !ex.s.includes('Min') && !ex.s.toLowerCase().includes('sek') && ex.s.includes('×');
          const wKey = exerciseWeightKey(phaseKey, dow, variantKey, i);
          let lastSummary = null;
          if(ex.perf){
            const lp = getPerfHistory(ex.perf.key, 1)[0];
            lastSummary = lp ? lp.value : null;
          } else if(isMachine){
            const lastEntry = getWeightHistory(wKey, 1)[0];
            lastSummary = lastEntry ? lastEntry.weights.filter(w=>w).join('/') + ' kg' : null;
          }
          return `
            <div class="exercise-row">
              <div class="exercise" data-k="${k}">
                <div class="exercise-check ${checked?'checked':''}">
                  <svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
                <div class="exercise-name-wrap">
                  <div class="exercise-name ${checked?'done':''}">${ex.n}</div>
                  ${lastSummary ? `<div class="exercise-last-weight">zuletzt: ${lastSummary}</div>` : ''}
                </div>
                <div class="exercise-sets">${ex.s}</div>
                ${ex.perf ? `<button class="perf-btn" data-pi="${i}" aria-label="Zeit/Ergebnis eintragen">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M9 2h6"/></svg>
                </button>` : ''}
                ${isMachine ? `<button class="weight-btn" data-wi="${wKey}_${dk}" aria-label="Gewicht eintragen">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="12" r="3"/><circle cx="18" cy="12" r="3"/><path d="M9 12h6M3 9v6M21 9v6"/></svg>
                </button>` : ''}
                ${hasMuscles ? `<button class="muscle-info-btn" data-mi="${k}" aria-label="Trainierte Muskeln anzeigen">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                </button>` : ''}
              </div>
              ${hasMuscles ? `<div class="muscle-panel" id="mp_${k}"></div>` : ''}
              ${isMachine ? `<div class="weight-panel" id="wp_${wKey}_${dk}"></div>` : ''}
              ${ex.perf ? `<div class="perf-panel" id="pp_${i}"></div>` : ''}
            </div>
          `;
        }).join('')}
      </div>
      <div class="day-note">
        <label class="day-note-label">Notiz zum Tag</label>
        <textarea class="day-note-input" id="dayNoteInput" placeholder="z.B. stark drauf / schlapp · neue Bestzeit · Beobachtung …">${escapeHtml(state.dayNotes[dk] || '')}</textarea>
      </div>
      ${isChoice ? `<a class="change-choice" id="changeChoiceDetail">Training wechseln</a>` : ''}
    </div>
  `;
  // Tagesnotiz: bei jeder Eingabe speichern (ohne Re-Render, damit der Fokus bleibt)
  const noteInput = document.getElementById('dayNoteInput');
  noteInput.oninput = ()=>{
    const v = noteInput.value.trim();
    if(v) state.dayNotes[dk] = v; else delete state.dayNotes[dk];
    saveState();
  };
  if(isChoice){
    document.getElementById('changeChoiceDetail').onclick = ()=>{
      delete state.variantChoice[dk];
      saveState();
      renderDayDetail();
    };
  }
  el.querySelectorAll('.exercise').forEach(item=>{
    item.onclick = (evt)=>{
      if(evt.target.closest('.muscle-info-btn') || evt.target.closest('.weight-btn') || evt.target.closest('.perf-btn')) return;
      const k = item.dataset.k;
      state.exercises[k] = !state.exercises[k];
      checkDayCompletion(dk, dow);
      saveState();
      renderDayDetail();
      renderProgress();
      renderStreak();
      renderToday();
    };
  });

  // Muskelinfo-Buttons: Panel mit Körpergrafik auf-/zuklappen
  el.querySelectorAll('.muscle-info-btn').forEach(btn=>{
    btn.onclick = (evt)=>{
      evt.stopPropagation();
      const k = btn.dataset.mi;
      const panel = document.getElementById(`mp_${k}`);
      const isOpen = panel.classList.contains('open');
      el.querySelectorAll('.muscle-panel.open, .weight-panel.open, .perf-panel.open').forEach(p=> p.classList.remove('open'));
      if(!isOpen){
        const idx = parseInt(k.split('_').pop());
        const ex = plan.exercises[idx];
        panel.innerHTML = renderBodySvg(ex.m || []);
        panel.classList.add('open');
      }
    };
  });

  // Gewicht-Buttons: Panel mit Satz-Eingabefeldern + Verlauf auf-/zuklappen
  el.querySelectorAll('.weight-btn').forEach(btn=>{
    btn.onclick = (evt)=>{
      evt.stopPropagation();
      const fullKey = btn.dataset.wi; // wKey_dk
      const panel = document.getElementById(`wp_${fullKey}`);
      const isOpen = panel.classList.contains('open');
      el.querySelectorAll('.muscle-panel.open, .weight-panel.open, .perf-panel.open').forEach(p=> p.classList.remove('open'));
      if(!isOpen){
        // wKey = alles bis auf das letzte _dk Segment (dk hat Format YYYY-MM-DD, also 3 Teile mit _)
        const wKey = fullKey.replace(`_${dk}`, '');
        renderWeightPanel(panel, wKey, dk, plan, btn);
        panel.classList.add('open');
      }
    };
  });

  // Hyrox-Zeit-Buttons: Panel mit Zeit/Ergebnis-Eingabe + Test-Verlauf auf-/zuklappen
  el.querySelectorAll('.perf-btn').forEach(btn=>{
    btn.onclick = (evt)=>{
      evt.stopPropagation();
      const idx = parseInt(btn.dataset.pi);
      const panel = document.getElementById(`pp_${idx}`);
      const isOpen = panel.classList.contains('open');
      el.querySelectorAll('.muscle-panel.open, .weight-panel.open, .perf-panel.open').forEach(p=> p.classList.remove('open'));
      if(!isOpen){
        renderPerfPanel(panel, plan.exercises[idx].perf, dk);
        panel.classList.add('open');
      }
    };
  });
}

// Baut das Eingabe-Panel für Satzgewichte + Verlaufsanzeige
function renderWeightPanel(panel, wKey, dk, plan, btn){
  const exIdx = parseInt(btn.closest('.exercise-row').querySelector('.exercise').dataset.k.split('_').pop());
  const ex = plan.exercises[exIdx];
  const setCount = parseSetCount(ex.s);
  const todayEntry = (state.weights[wKey] || []).find(e=>e.date===dk);
  const currentWeights = todayEntry ? todayEntry.weights : Array(setCount).fill('');
  const history = getWeightHistory(wKey, 3).filter(e=>e.date!==dk);

  panel.innerHTML = `
    <div class="weight-input-title">Gewicht pro Satz (kg)</div>
    <div class="weight-input-row">
      ${Array.from({length:setCount}).map((_,si)=>`
        <div class="weight-input-group">
          <label class="weight-input-label">Satz ${si+1}</label>
          <input type="number" inputmode="decimal" class="weight-input" data-set="${si}" value="${currentWeights[si]||''}" placeholder="0">
        </div>
      `).join('')}
    </div>
    <button class="weight-save-btn">Speichern</button>
    ${history.length ? `
      <div class="weight-history-title">Letzte Einträge</div>
      <div class="weight-history-list">
        ${history.map(h=>{
          const d = new Date(h.date);
          const dateLabel = d.toLocaleDateString('de-DE',{day:'2-digit', month:'2-digit'});
          return `<div class="weight-history-item"><span>${dateLabel}</span><span>${h.weights.filter(w=>w).join(' / ')} kg</span></div>`;
        }).join('')}
      </div>
    ` : ''}
  `;

  panel.querySelector('.weight-save-btn').onclick = ()=>{
    const inputs = panel.querySelectorAll('.weight-input');
    const weights = Array.from(inputs).map(inp => inp.value ? parseFloat(inp.value) : null);
    saveWeightEntry(wKey, dk, weights);
    renderDayDetail(); // neu rendern um "zuletzt: X kg" sofort zu aktualisieren
  };
}

// ===== HYROX-ZEIT/ERGEBNIS-TRACKING (perf) =====
// Speichert je Disziplin (discKey, nicht datums-/tagesabhängig) ein Ergebnis pro
// Test-Datum, damit man über mehrere Tests hinweg vergleichen kann.
function savePerfEntry(discKey, dk, value){
  if(!state.perf[discKey]) state.perf[discKey] = [];
  const arr = state.perf[discKey];
  const i = arr.findIndex(e=>e.date===dk);
  if(!value){ if(i>=0) arr.splice(i,1); }       // leer = Eintrag löschen
  else if(i>=0) arr[i].value = value;            // heutigen überschreiben
  else arr.push({ date:dk, value });
  arr.sort((a,b)=> a.date.localeCompare(b.date));
  saveState();
}
function getPerfHistory(discKey, limit=4){
  const all = state.perf[discKey] || [];
  return all.slice(-limit).reverse(); // neuste zuerst
}

// Baut das Eingabe-Panel für eine Hyrox-Disziplin (Zeit/Ergebnis + Test-Verlauf)
function renderPerfPanel(panel, perf, dk){
  const all = state.perf[perf.key] || [];
  const todayEntry = all.find(e=>e.date===dk);
  const history = all.filter(e=>e.date!==dk).slice(-4).reverse();
  panel.innerHTML = `
    <div class="perf-input-title">${perf.label} – Zeit / Ergebnis</div>
    <div class="perf-input-row">
      <input type="text" class="perf-input" value="${todayEntry ? todayEntry.value : ''}" placeholder="z.B. 3:45 · 0:48 · 100 Wdh">
      <button class="perf-save-btn">Speichern</button>
    </div>
    ${history.length ? `
      <div class="perf-history-title">Letzte Tests (zum Vergleich)</div>
      <div class="perf-history-list">
        ${history.map(h=>{
          const d = dateFromKey(h.date);
          return `<div class="perf-history-item"><span>${d.toLocaleDateString('de-DE',{day:'2-digit', month:'2-digit'})}</span><span>${h.value}</span></div>`;
        }).join('')}
      </div>
    ` : ''}
  `;
  panel.querySelector('.perf-save-btn').onclick = ()=>{
    savePerfEntry(perf.key, dk, panel.querySelector('.perf-input').value.trim());
    renderDayDetail(); // "zuletzt: …" sofort aktualisieren
  };
}

function checkDayCompletion(dk, dow){
  const entry = planEntry(dow, dateFromKey(dk));
  const plan = entry.type === 'choice' ? resolvePlan(dow, dk) : entry;
  if(!plan) { state.completedDays[dk] = false; return; }
  const realExercises = plan.exercises.filter(ex=>!ex.n.startsWith('—'));
  const allDone = plan.exercises.every((ex,i)=> ex.n.startsWith('—') || state.exercises[`${dk}_${i}`]);
  state.completedDays[dk] = realExercises.length > 0 && allDone;
}

// ===== RENDER: WEEK PROGRESS =====
function renderProgress(){
  const dates = getWeekDates();
  let done = 0;
  dates.forEach(d=>{
    const dk = todayKey(d);
    if(state.completedDays[dk]) done++;
  });
  const total = 7;
  const pct = Math.round(done/total*100);
  const circumference = 125.6;
  const offset = circumference - (pct/100*circumference);
  document.getElementById('ringFg').style.strokeDashoffset = offset;
  document.getElementById('ringPct').textContent = pct + '%';
  document.getElementById('progressLabel').textContent = `${done} von ${total}`;
}

// ===== RENDER: WOCHEN-VOLUMEN (Verlauf) =====
// Die letzten 6 Wochen als Balken: wie viele Trainings je Woche abgeschlossen.
function renderVolume(){
  const el = document.getElementById('volumeOverview');
  if(!el) return;
  const WEEKS = 6;
  const mondayThis = mondayOf(new Date());
  const cols = [];
  for(let w=WEEKS-1; w>=0; w--){
    const mon = new Date(mondayThis);
    mon.setDate(mon.getDate() - w*7);
    let done = 0;
    for(let i=0;i<7;i++){
      const day = new Date(mon);
      day.setDate(day.getDate()+i);
      if(state.completedDays[todayKey(day)]) done++;
    }
    cols.push({ done, isCurrent: w===0, label: mon.toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit'}) });
  }
  const totalDone = cols.reduce((s,c)=>s+c.done,0);
  const avg = (totalDone/WEEKS).toFixed(1).replace('.',',');
  const maxBar = 64; // px für 7 Trainings
  el.innerHTML = `
    <div class="vol-card">
      <div class="vol-summary">Ø <b>${avg}</b> Trainings/Woche · ${totalDone} in ${WEEKS} Wochen</div>
      <div class="vol-bars">
        ${cols.map(c=>`
          <div class="vol-col">
            <div class="vol-count">${c.done}</div>
            <div class="vol-bar-track">
              <div class="vol-bar ${c.isCurrent?'current':''}" style="height:${Math.round(c.done/7*maxBar)}px"></div>
            </div>
            <div class="vol-label ${c.isCurrent?'current':''}">${c.isCurrent?'Diese':c.label}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ===== RENDER: FOOD VIEW =====
// Phasen-Ernährungskarte über den Tages-Tabs: was diese Phase wirklich braucht.
function renderNutritionPhase(){
  const el = document.getElementById('nutritionPhase');
  if(!el) return;
  const phase = phaseForDate(new Date());
  const n = PHASE_NUTRITION[phase.key];
  el.innerHTML = `
    <div class="nutri-card">
      <div class="nc-badge">${phase.label} · Ernährung</div>
      <div class="nc-focus">${n.focus}</div>
      <div class="nutri-macros">
        <div class="nutri-macro"><b>Kalorien:</b> ${n.kcal}</div>
        <div class="nutri-macro"><b>Eiweiß:</b> ${n.protein}</div>
        <div class="nutri-macro"><b>Kohlenhydrate:</b> ${n.carbs}</div>
      </div>
      <div class="nutri-tips">
        ${n.tips.map(t=>`<div class="nutri-tip">${t}</div>`).join('')}
      </div>
    </div>
  `;
}

// ===== RENDER: WASSER-TRACKER =====
// 1 Glas = 250 ml. Tagesziel 10 Gläser (2,5 l). Pro Tag in state.water gespeichert.
const WATER_GOAL = 10;
function setWaterToday(n){
  const dk = todayKey(new Date());
  const v = Math.max(0, Math.min(20, n));
  if(v===0) delete state.water[dk]; else state.water[dk] = v;
  saveState();
  renderWater();
}
function renderWater(){
  const el = document.getElementById('waterTracker');
  if(!el) return;
  const dk = todayKey(new Date());
  const n = state.water[dk] || 0;
  const liters = (n*0.25).toLocaleString('de-DE',{minimumFractionDigits:1, maximumFractionDigits:2});
  const reached = n >= WATER_GOAL;
  const dots = Array.from({length:WATER_GOAL}).map((_,i)=>
    `<span class="water-dot ${i<n?'on':''}" data-n="${i+1}"></span>`
  ).join('');
  el.innerHTML = `
    <div class="water-card">
      <div class="water-top">
        <div class="water-label">Wasser heute</div>
        <div class="water-amount ${reached?'goal':''}">${n} <span>Gläser · ${liters} l</span></div>
      </div>
      <div class="water-dots">${dots}</div>
      <div class="water-ctrl">
        <button class="water-btn" id="waterMinus" aria-label="Glas abziehen">−</button>
        <div class="water-goal">${reached ? '✓ Ziel erreicht (2,5 l)' : `Ziel: ${WATER_GOAL} Gläser / 2,5 l`}</div>
        <button class="water-btn" id="waterPlus" aria-label="Glas hinzufügen">+</button>
      </div>
    </div>
  `;
  el.querySelector('#waterPlus').onclick = ()=> setWaterToday(n+1);
  el.querySelector('#waterMinus').onclick = ()=> setWaterToday(n-1);
  el.querySelectorAll('.water-dot').forEach(dot=>{
    dot.onclick = ()=>{
      const target = parseInt(dot.dataset.n);
      setWaterToday(target===n ? target-1 : target); // letztes volles Glas erneut antippen = eins zurück
    };
  });
}

function renderFoodTabs(){
  const tabsEl = document.getElementById('foodDayTabs');
  const order = [1,2,3,4,5,6,0];
  const today = new Date().getDay(); // 0=So .. 6=Sa – Essen-Tab startet auf heute
  tabsEl.innerHTML = order.map((d)=>
    `<button class="tab-btn ${d===today?'active':''}" data-day="${d}">${WEEKDAYS[d]}</button>`
  ).join('');
  tabsEl.querySelectorAll('.tab-btn').forEach(btn=>{
    btn.onclick = ()=>{
      tabsEl.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      renderFoodContent(parseInt(btn.dataset.day));
    };
  });
  // Aktiven Tag sichtbar machen, falls die Tab-Leiste horizontal scrollt (z.B. So rechts).
  tabsEl.querySelector('.tab-btn.active')?.scrollIntoView({inline:'center', block:'nearest'});
  renderFoodContent(today);
}

// Basis-Tagesziel, auf das die kcal-Werte im FOOD_PLAN ausgelegt sind.
const PLAN_KCAL_BASE = 2250;
// Persönlicher kcal-Faktor (nur Anzeige-Skalierung). Begrenzt auf 0.5–2.0;
// ohne/ungültiges Ziel oder außerhalb des Bereichs → 1 (Standardwerte, schützt
// vor absurder Skalierung bei Tippfehlern). FOOD_PLAN bleibt unverändert.
function kcalFactor(){
  const t = state.profile && Number(state.profile.kcalTarget);
  if(!t || !isFinite(t)) return 1;
  const f = t / PLAN_KCAL_BASE;
  return (f < 0.5 || f > 2.0) ? 1 : f;
}

function renderFoodContent(dow){
  const data = FOOD_PLAN[dow];
  const el = document.getElementById('foodContent');
  // Zirkel-Variante zeigen, wenn für diesen Tag (aktuelle Woche) Zirkel gewählt
  // wurde. Tage ohne zirkelMeals bleiben unberührt.
  let meals = data.meals;
  let isZirkel = false;
  if(data.zirkelMeals && state.variantChoice[dateKeyForDow(dow)] === 'zirkel'){
    meals = data.zirkelMeals;
    isZirkel = true;
  }
  // Persönliche kcal-Skalierung (nur Anzeige). Bei Faktor 1 exakt die Originalwerte.
  const factor = kcalFactor();
  const scaleNum = (s)=>{
    const mm = String(s).match(/\d+/);
    if(!mm) return 0;
    const n = parseInt(mm[0]);
    return factor === 1 ? n : Math.round(n * factor / 10) * 10;
  };
  const scaleStr = (s)=>{
    const mm = String(s).match(/\d+/);
    if(!mm) return s; // leere Angaben (z.B. Trainings-Marker) unverändert
    return factor === 1 ? s : String(s).replace(/\d+/, scaleNum(s));
  };
  // Tagessumme aus den (skalierten) kcal-Angaben der Mahlzeiten.
  const total = meals.reduce((sum,m)=> sum + scaleNum(m.kcal), 0);
  el.innerHTML = `
    <div class="day-kcal-total">Tagessumme <b>~${total} kcal</b>${isZirkel ? ' · <span class="zirkel-flag">Zirkeltag</span>' : ''}</div>
  ` + meals.map(m=>`
    <div class="meal-card${m.marker ? ' meal-marker' : ''}">
      <div class="meal-top">
        <span class="meal-time">${m.time}</span>
        <span class="meal-kcal">${scaleStr(m.kcal)}</span>
      </div>
      <div class="meal-name">${m.name}</div>
      <div class="meal-items">${m.items}</div>
    </div>
  `).join('');
}

// ===== RENDER: SHOP VIEW =====
// Kalenderwoche bestimmt automatisch Großeinkauf(1)/Auffüllen(2) – gerade/ungerade.
function currentShopWeek(){
  const ref = new Date(2026,0,5); // fester Montag als Nullpunkt
  const week = Math.floor((new Date() - ref) / (7*24*60*60*1000));
  return (week % 2 === 0) ? 1 : 2;
}

// Phasen-Banner im Einkauf-Tab – konsistent zu Heute/Ernährung.
function renderShopPhase(){
  const el = document.getElementById('shopPhase');
  if(!el) return;
  const phase = phaseForDate(new Date());
  const extra = PHASE_SHOP[phase.key];
  const sub = (extra && extra.length) ? extra[0].cat : 'Basis-Einkauf – deckt den Wochenplan ab';
  el.innerHTML = `
    <div class="phase-banner">
      <div class="pb-badge">${phase.label}</div>
      <div class="pb-text">
        <div class="pb-title">Einkauf: ${phase.label}</div>
        <div class="pb-sub">${sub}</div>
      </div>
    </div>
  `;
}

function renderShopToggle(){
  const el = document.getElementById('shopWeekToggle');
  const auto = currentShopWeek();
  el.innerHTML = `
    <button class="wk-btn ${state.shopWeek===1?'active':''}" data-w="1">Großeinkauf${auto===1?' · aktuell':''}</button>
    <button class="wk-btn ${state.shopWeek===2?'active':''}" data-w="2">Auffüllen${auto===2?' · aktuell':''}</button>
  `;
  el.querySelectorAll('.wk-btn').forEach(btn=>{
    btn.onclick = ()=>{
      state.shopWeek = parseInt(btn.dataset.w);
      saveState();
      renderShopToggle();
      renderShopContent();
    };
  });
}

function renderShopContent(){
  const w = state.shopWeek;
  const phase = phaseForDate(new Date());
  // Basis-Liste + phasenspezifische Zusatz-Kategorien (datum-/phasenabhängig).
  const cats = SHOP_LIST[w].concat(PHASE_SHOP[phase.key] || []);
  const el = document.getElementById('shopContent');
  el.innerHTML = cats.map((cat,ci)=>`
    <div class="shop-cat">
      <div class="shop-cat-title">${cat.cat}</div>
      ${cat.items.map((item,ii)=>{
        const k = `w${w}_${ci}_${ii}`;
        const checked = !!state.shop[k];
        return `
          <div class="shop-item" data-k="${k}">
            <div class="shop-check ${checked?'checked':''}">
              <svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
            </div>
            <div class="shop-name ${checked?'done':''}">${item}</div>
          </div>
        `;
      }).join('')}
    </div>
  `).join('');
  el.querySelectorAll('.shop-item').forEach(item=>{
    item.onclick = ()=>{
      const k = item.dataset.k;
      state.shop[k] = !state.shop[k];
      saveState();
      renderShopContent();
    };
  });
}

document.getElementById('shopReset').onclick = ()=>{
  const w = state.shopWeek;
  Object.keys(state.shop).forEach(k=>{
    if(k.startsWith(`w${w}_`)) delete state.shop[k];
  });
  saveState();
  renderShopContent();
};

// ===== RENDER: ESN 8-WOCHEN-PLAN =====
// Offene Sessions nur in-memory (nicht persistiert) – hält Akkordeons beim
// Re-Render auf. Key: 'w{week}_{sessionIdx}'.
let esnOpenSessions = new Set();

// Welche ESN-Woche passt zum aktuellen Datum? null = noch außerhalb des 8-Wochen-Fensters.
function suggestedEsnWeek(){
  const w = weeksUntilRace(new Date());
  if(w > 8) return null;
  return Math.min(8, Math.max(1, 9 - w));
}
// SkiErg gibt's nur im Physio Loft Bramsche – Sessions mit Ski entsprechend markieren.
function sessionUsesSki(session){
  return session.blocks.some(b => (b.items||[]).some(it => /\bSki\b/.test(it.n)));
}
function esnItemKey(weekN, sIdx, bIdx, iIdx){ return `w${weekN}_${sIdx}_${bIdx}_${iIdx}`; }

// Zählt erledigte / gesamte abhakbare Punkte einer Session.
function esnSessionProgress(weekN, sIdx, session){
  let done=0, total=0;
  session.blocks.forEach((b,bIdx)=>(b.items||[]).forEach((_,iIdx)=>{
    total++;
    if(state.esnChecks[esnItemKey(weekN,sIdx,bIdx,iIdx)]) done++;
  }));
  return { done, total };
}

function renderEsnHint(){
  const el = document.getElementById('esnHint');
  if(!el) return;
  el.innerHTML = `
    <div class="esn-hint">
      <div class="esn-hint-title">ESN Hyrox-Vorbereitung · 8 Wochen</div>
      <div class="esn-hint-text">Kompletter Nachschlage-Plan zum Abhaken – läuft parallel zu deinem eigenen Wochenplan. Intensität nach RPE (1 = ganz locker, 10 = all out). <b>SkiErg gibt’s nur im Physio Loft Bramsche</b> – betroffene Sessions sind markiert (Eragym & Matrix haben Sled, Wall Balls, KB, Row & Bike).</div>
    </div>
  `;
}

function renderEsnWeekToggle(){
  const el = document.getElementById('esnWeekToggle');
  if(!el) return;
  const sug = suggestedEsnWeek();
  el.innerHTML = ESN_PLAN.weeks.map(w=>{
    const active = w.n === state.esnWeek ? ' active' : '';
    const now = (w.n === sug) ? ' · jetzt' : '';
    return `<button class="tab-btn${active}" data-w="${w.n}">W${w.n}${now}</button>`;
  }).join('');
  el.querySelectorAll('.tab-btn').forEach(btn=>{
    btn.onclick = ()=>{
      state.esnWeek = parseInt(btn.dataset.w);
      saveState();
      renderEsnWeekToggle();
      renderEsnWeekNote();
      renderEsnContent();
    };
  });
}

function renderEsnWeekNote(){
  const el = document.getElementById('esnWeekNote');
  if(!el) return;
  const week = ESN_PLAN.weeks.find(w=>w.n===state.esnWeek);
  el.innerHTML = (week && week.note) ? `<div class="esn-week-note">${week.note}</div>` : '';
}

function renderEsnContent(){
  const el = document.getElementById('esnContent');
  if(!el) return;
  const week = ESN_PLAN.weeks.find(w=>w.n===state.esnWeek);
  if(!week){ el.innerHTML=''; return; }

  el.innerHTML = week.sessions.map((session,sIdx)=>{
    const openKey = `w${week.n}_${sIdx}`;
    const isOpen = esnOpenSessions.has(openKey);
    const { done, total } = esnSessionProgress(week.n, sIdx, session);
    const ski = sessionUsesSki(session);
    const cls = (done>0 && done===total) ? 'done' : (ski ? 'ski' : '');

    const blocksHtml = session.blocks.map((b,bIdx)=>{
      const items = (b.items||[]).map((it,iIdx)=>{
        const k = esnItemKey(week.n, sIdx, bIdx, iIdx);
        const checked = !!state.esnChecks[k];
        return `
          <div class="exercise-row">
            <div class="exercise esn-item" data-k="${k}">
              <div class="exercise-check ${checked?'checked':''}">
                <svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
              </div>
              <div class="exercise-name-wrap">
                <div class="exercise-name ${checked?'done':''}">${it.n}</div>
              </div>
              <div class="exercise-sets">${it.s||''}</div>
            </div>
          </div>`;
      }).join('');
      return `
        <div class="esn-block ${b.info?'info':''}">
          <div class="esn-block-head"><span>${b.head}</span>${b.meta?`<span class="esn-block-meta">${b.meta}</span>`:''}</div>
          ${items ? `<div class="exercise-list">${items}</div>` : ''}
          ${b.note ? `<div class="esn-block-note">${b.note}</div>` : ''}
        </div>`;
    }).join('');

    return `
      <div class="esn-session ${cls} ${isOpen?'open':''}">
        <div class="esn-session-head" data-open="${openKey}">
          <div class="esn-session-main">
            <div class="esn-session-name">${session.name}</div>
            <div class="esn-session-sub">${session.sub||''}</div>
          </div>
          ${total ? `<div class="esn-session-count">${done}/${total}</div>` : ''}
          <svg class="esn-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
        </div>
        ${ski ? `<div class="esn-ski-badge">SkiErg → nur Physio Loft Bramsche</div>` : ''}
        <div class="esn-session-body">${blocksHtml}</div>
      </div>`;
  }).join('');

  // Session auf-/zuklappen
  el.querySelectorAll('.esn-session-head').forEach(head=>{
    head.onclick = ()=>{
      const key = head.dataset.open;
      if(esnOpenSessions.has(key)) esnOpenSessions.delete(key); else esnOpenSessions.add(key);
      renderEsnContent();
    };
  });
  // Punkt abhaken
  el.querySelectorAll('.esn-item').forEach(item=>{
    item.onclick = ()=>{
      const k = item.dataset.k;
      if(state.esnChecks[k]) delete state.esnChecks[k]; else state.esnChecks[k] = true;
      saveState();
      renderEsnContent();
    };
  });
}

function renderEsn(){
  if(!state.esnWeek) state.esnWeek = suggestedEsnWeek() || 1;
  renderEsnHint();
  renderEsnWeekToggle();
  renderEsnWeekNote();
  renderEsnContent();
}

// ===== RENDER: HISTORY VIEW =====
function renderHistory(){
  const el = document.getElementById('historyContent');
  const completedDates = Object.keys(state.completedDays).filter(k=>state.completedDays[k]).sort().reverse();
  if(completedDates.length===0){
    el.innerHTML = `<div class="empty-note">Noch keine abgeschlossenen Trainingstage.<br>Hak Übungen im Tab "Heute" ab.</div>`;
    return;
  }
  el.innerHTML = `
    <div class="progress-card" style="margin-bottom:14px">
      <div class="progress-text" style="text-align:center; width:100%">
        <div class="pl">Trainingstage gesamt</div>
        <div class="pv" style="font-size:24px">${completedDates.length}</div>
      </div>
    </div>
  ` + completedDates.map(dk=>{
    const d = dateFromKey(dk);
    const dow = d.getDay();
    const entry = planEntry(dow, d);
    const plan = entry.type === 'choice' ? (resolvePlan(dow, dk) || entry.variants[Object.keys(entry.variants)[0]]) : entry;
    const note = state.dayNotes[dk];
    return `
      <div class="meal-card">
        <div class="meal-top">
          <span class="meal-time">${d.toLocaleDateString('de-DE',{weekday:'long', day:'numeric', month:'short'})}</span>
        </div>
        <div class="meal-name">${plan.title}</div>
        ${note ? `<div class="history-note">📝 ${escapeHtml(note)}</div>` : ''}
      </div>
    `;
  }).join('');
}

document.getElementById('hardReset').onclick = ()=>{
  if(confirm('Wirklich alle Haken und den Verlauf zurücksetzen?')){
    state = defaultState();
    saveState();
    renderAll();
  }
};

// ===== BACKUP: EXPORT / IMPORT =====
// Standardwerte für den State — zentrale Quelle, von loadState/hardReset/Import genutzt.
function defaultState(){
  return {
    exercises:{}, shop:{}, shopWeek:1, completedDays:{}, variantChoice:{}, weights:{},
    esnChecks:{},     // ESN-Plan Haken: { 'w{week}_{s}_{b}_{i}': true }
    esnWeek:null,     // zuletzt gewählte ESN-Woche (1-8), null = Auto beim Start
    dayNotes:{},      // Notiz je Tag: { 'YYYY-MM-DD': 'text' }
    bodyWeights:[],   // Körpergewicht: [{ date:'YYYY-MM-DD', kg:Number }]
    prs:{},           // Bestzeiten: { feldKey: 'wert' }
    perf:{},          // Hyrox-Zeiten je Disziplin: { discKey: [{ date, value }] }
    hyroxDate:DEFAULT_HYROX_DATE, // Renndatum 'YYYY-MM-DD', im UI editierbar
    lastBackup:null,  // todayKey des letzten Exports
    water:{},         // Wasser je Tag: { 'YYYY-MM-DD': anzahlGläser } (1 Glas = 250 ml)
    profile:{ name:'', weightKg:null, kcalTarget:null, startPhase:'base' }, // pro Gerät/Person
  };
}

// Lädt den aktuellen state als JSON-Datei herunter. Dateiname mit lokalem
// Datum (todayKey, KEIN toISOString wegen Zeitzonen-Verschiebung).
function exportBackup(){
  state.lastBackup = todayKey(new Date()); // Backup-Zeitpunkt merken
  saveState();
  const json = JSON.stringify(state, null, 2);
  const blob = new Blob([json], { type:'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `hyrox-backup-${todayKey(new Date())}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  renderBackupHint();
}

// Prüft, ob ein eingelesenes Objekt plausibel ein Hyrox-State ist.
function isPlausibleState(obj){
  if(!obj || typeof obj !== 'object') return false;
  // Mindestens ein paar der erwarteten Keys müssen als Objekt vorhanden sein.
  return ['exercises','shop','completedDays','variantChoice','weights']
    .some(k => obj[k] && typeof obj[k] === 'object');
}

// Liest die ausgewählte Datei, parst sie und übernimmt sie nach Bestätigung.
function importBackup(file){
  const reader = new FileReader();
  reader.onload = ()=>{
    try{
      const parsed = JSON.parse(reader.result);
      if(!isPlausibleState(parsed)) throw new Error('Keine gültige Backup-Datei');
      if(!confirm('Aktuellen Stand mit dem Backup überschreiben? Deine jetzigen Daten gehen dabei verloren.')) return;
      // Fehlende Keys mit Defaults auffüllen (wie loadState es für weights macht).
      state = Object.assign(defaultState(), parsed);
      saveState();
      renderAll();
      alert('Backup wurde erfolgreich importiert.');
    }catch(e){
      alert('Datei konnte nicht gelesen werden – ist das eine gültige Backup-Datei?');
    }
  };
  reader.onerror = ()=> alert('Datei konnte nicht gelesen werden.');
  reader.readAsText(file);
}

document.getElementById('exportBackup').onclick = exportBackup;
document.getElementById('importBackup').onclick = ()=> document.getElementById('importFile').click();
document.getElementById('importFile').onchange = (evt)=>{
  const file = evt.target.files[0];
  if(file) importBackup(file);
  evt.target.value = ''; // erlaubt erneuten Import derselben Datei
};

// ===== NAV =====
document.querySelectorAll('.nav-btn').forEach(btn=>{
  btn.onclick = ()=>{
    document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('view-'+btn.dataset.view).classList.add('active');
    if(btn.dataset.view==='fortschritt'){ renderProfile(); renderHistory(); renderBackupHint(); renderBodyWeight(); renderPRs(); renderVolume(); }
    if(btn.dataset.view==='esn'){ renderEsn(); }
  };
});

// ===== INIT =====
function renderAll(){
  renderCountdown();
  renderPhaseBanner();
  renderPhaseRoadmap();
  renderHyroxInfo();
  renderProfile();
  renderBodyWeight();
  renderPRs();
  renderVolume();
  renderBackupHint();
  renderStreak();
  renderToday();
  renderWeek();
  renderDayDetail();
  renderProgress();
  renderNutritionPhase();
  renderWater();
  renderFoodTabs();
  state.shopWeek = currentShopWeek(); // beim Start automatisch auf Kalenderwoche syncen
  renderShopPhase();
  renderShopToggle();
  renderShopContent();
  renderEsn();
}

// ===== IN-WORKOUT-TIMER =====
// Eigenständiges Modul (DOM außerhalb der neu-rendernden Bereiche). Zwei Modi:
// Pause (einfacher Countdown) und Intervall (Belastung/Pause × Runden, EMOM-tauglich).
// Akustik via Web Audio, Vibration via navigator.vibrate. Nicht persistiert.
const Timer = (function(){
  let mode='pause', running=false, remaining=0, phase='', round=0, id=null;
  const cfg = { pause:90, work:40, rest:20, rounds:8 };
  let audioCtx=null;
  const $ = (i)=>document.getElementById(i);
  const fmt = (s)=>{ s=Math.max(0,s); return Math.floor(s/60)+':'+String(s%60).padStart(2,'0'); };

  function beep(freq, dur){
    try{
      audioCtx = audioCtx || new (window.AudioContext||window.webkitAudioContext)();
      const o=audioCtx.createOscillator(), g=audioCtx.createGain();
      o.frequency.value=freq; o.connect(g); g.connect(audioCtx.destination);
      const t=audioCtx.currentTime;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.3, t+0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t+dur);
      o.start(t); o.stop(t+dur);
    }catch(e){}
  }
  const buzz = (p)=>{ if(navigator.vibrate) navigator.vibrate(p); };
  function signal(kind){
    if(kind==='go'){ beep(880,0.18); buzz(120); }
    else if(kind==='rest'){ beep(440,0.18); buzz(80); }
    else if(kind==='done'){ beep(660,0.12); setTimeout(()=>beep(880,0.12),150); setTimeout(()=>beep(1150,0.25),300); buzz([120,80,120,80,200]); }
  }
  function updateDisplay(){
    $('timerTime').textContent = fmt(remaining);
    let label='Bereit';
    if(mode==='pause'){ label = (phase==='done') ? 'Fertig 💪' : (running ? 'Pause läuft' : 'Bereit'); }
    else if(phase==='work') label = 'Belastung · Runde '+round+'/'+cfg.rounds;
    else if(phase==='rest') label = 'Pause · Runde '+round+'/'+cfg.rounds;
    else if(phase==='done') label = 'Fertig 💪';
    const ph=$('timerPhase');
    ph.textContent=label;
    ph.className='timer-phase'+(phase==='work'?' work':(phase==='rest'?' rest':''));
  }
  function readCfg(){
    cfg.pause  = Math.max(1, parseInt($('timerPauseSec').value)||90);
    cfg.work   = Math.max(1, parseInt($('tWork').value)||40);
    cfg.rest   = Math.max(0, parseInt($('tRest').value)||0);
    cfg.rounds = Math.max(1, parseInt($('tRounds').value)||1);
  }
  function tick(){
    remaining--;
    if(remaining>0){ if(remaining<=3) beep(700,0.07); updateDisplay(); return; }
    if(mode==='pause'){ stop(); phase='done'; remaining=0; signal('done'); updateDisplay(); return; }
    if(phase==='work'){
      if(cfg.rest>0){ phase='rest'; remaining=cfg.rest; signal('rest'); updateDisplay(); return; }
      if(round<cfg.rounds){ round++; remaining=cfg.work; signal('go'); updateDisplay(); return; }
      return finish();
    }
    if(phase==='rest'){
      if(round<cfg.rounds){ round++; phase='work'; remaining=cfg.work; signal('go'); updateDisplay(); return; }
      return finish();
    }
  }
  function finish(){ stop(); phase='done'; remaining=0; signal('done'); updateDisplay(); }
  function start(){
    if(running) return;
    readCfg();
    if(phase==='' || phase==='done'){ // frischer Start
      if(mode==='pause'){ phase='pause'; remaining=cfg.pause; }
      else { round=1; phase='work'; remaining=cfg.work; }
      signal('go');
    }
    running=true; $('timerStart').textContent='Pause';
    id=setInterval(tick,1000); updateDisplay();
  }
  function pause(){ running=false; if(id) clearInterval(id); id=null; $('timerStart').textContent='Weiter'; }
  function stop(){ running=false; if(id) clearInterval(id); id=null; $('timerStart').textContent='Start'; }
  function reset(){ stop(); phase=''; round=0; readCfg(); remaining = (mode==='pause'?cfg.pause:cfg.work); updateDisplay(); }
  function setMode(m){
    mode=m;
    $('timerConfigPause').style.display    = m==='pause'    ? '' : 'none';
    $('timerConfigInterval').style.display = m==='interval' ? '' : 'none';
    document.querySelectorAll('.timer-mode').forEach(b=> b.classList.toggle('active', b.dataset.mode===m));
    reset();
  }
  function init(){
    if(!$('timerFab')) return;
    $('timerFab').onclick = ()=>{ const s=$('timerSheet'); s.classList.toggle('open'); if(s.classList.contains('open')) reset(); };
    $('timerClose').onclick = ()=> $('timerSheet').classList.remove('open');
    $('timerStart').onclick = ()=> running ? pause() : start();
    $('timerReset').onclick = reset;
    document.querySelectorAll('.timer-mode').forEach(b=> b.onclick=()=>setMode(b.dataset.mode));
    document.querySelectorAll('.timer-chip').forEach(c=> c.onclick=()=>{
      $('timerPauseSec').value=c.dataset.sec; stop(); phase=''; remaining=parseInt(c.dataset.sec); updateDisplay();
    });
    reset();
  }
  return { init };
})();
Timer.init();

renderAll();
