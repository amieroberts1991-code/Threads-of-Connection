/* ============================================
   Threads of Connection — Sample Stories Data
   File: threads-data.js
   ============================================ */

const sampleThreads = [
  {
    id: 1,
    title: "The Stranger Who Became Family",
    theme: "Connection",
    author: "Maria Santos",
    location: "Manila, Philippines",
    date: "2025-01-15",
    coordinates: [14.5995, 120.9842],
    preview:
      "During a typhoon, a stranger knocked on our door seeking shelter. That night changed everything...",
    content:
      "During a typhoon, a stranger knocked on our door seeking shelter. That night changed everything. We shared stories, food, and laughter despite the storm raging outside. Years later, she's now my closest friend and godmother to my children. Sometimes the greatest connections come from the most unexpected moments."
  },
  {
    id: 2,
    title: "My Father's Letters",
    theme: "Healing",
    author: "James Chen",
    location: "Toronto, Canada",
    date: "2025-01-10",
    coordinates: [43.6532, -79.3832],
    preview:
      "After my father passed, I found a box of letters he never sent. Each one taught me something new...",
    content:
      "After my father passed, I found a box of letters he never sent. Each one taught me something new about love, regret, and hope. Reading his words helped me understand him in ways I never could when he was alive. The healing came not from closure, but from finally seeing him as human—flawed, loving, and trying his best."
  },
  {
    id: 3,
    title: "Dancing in the Rain",
    theme: "Cultural",
    author: "Amara Okafor",
    location: "Lagos, Nigeria",
    date: "2025-01-08",
    coordinates: [6.5244, 3.3792],
    preview:
      "My grandmother taught me our traditional dance during the rainy season. It was more than movement...",
    content:
      "My grandmother taught me our traditional dance during the rainy season. It was more than movement—it was our history, our joy, our resistance. Each step told a story of our ancestors. Now I teach these dances to young girls in my community, watching their eyes light up as they connect with their heritage."
  },
  {
    id: 4,
    title: "The Garden We Built",
    theme: "Hope",
    author: "Sofia Rodriguez",
    location: "Barcelona, Spain",
    date: "2025-01-05",
    coordinates: [41.3851, 2.1734],
    preview:
      "In the middle of our concrete neighborhood, we decided to create something beautiful together...",
    content:
      "In the middle of our concrete neighborhood, we decided to create something beautiful together. What started as a small community garden became a symbol of hope. Neighbors who never spoke now share seeds, recipes, and stories. In a world that often feels divided, this little patch of earth reminds us that growth is possible."
  },
  {
    id: 5,
    title: "Painting Through the Pain",
    theme: "Creative",
    author: "Yuki Tanaka",
    location: "Kyoto, Japan",
    date: "2025-01-03",
    coordinates: [35.0116, 135.7681],
    preview:
      "After losing my job, I picked up a paintbrush for the first time in twenty years...",
    content:
      "After losing my job, I picked up a paintbrush for the first time in twenty years. What began as a way to fill empty days became my salvation. Each stroke was a conversation with myself, each color a different emotion. Now I run workshops for others going through transitions."
  },
  {
    id: 6,
    title: "The Bench Where We Met",
    theme: "Reflection",
    author: "David Kim",
    location: "Seoul, South Korea",
    date: "2025-01-01",
    coordinates: [37.5665, 126.9780],
    preview:
      "Every morning, I sit on the same park bench. One day, an elderly man joined me...",
    content:
      "Every morning, I sit on the same park bench. One day, an elderly man joined me. We didn't speak for weeks, just shared the silence and the sunrise. Eventually, we began talking—about life, regrets, dreams. He taught me that reflection isn't about dwelling on the past, but understanding it so we can move forward with wisdom."
  },
  {
    id: 7,
    title: "The Coat That Traveled",
    theme: "Kindness",
    author: "Emma Thompson",
    location: "London, United Kingdom",
    date: "2024-12-28",
    coordinates: [51.5074, -0.1278],
    preview:
      "I left my favorite coat on a train with a note in the pocket: 'Pass this on to someone who needs it'...",
    content:
      "I left my favorite coat on a train with a note in the pocket: 'Pass this on to someone who needs it.' Six months later, I received an email with photos of the coat's journey—it had been worn by a homeless veteran, a refugee family, a student struggling through winter. Each person added their note, creating a chain of kindness across the city."
  },
  {
    id: 8,
    title: "Learning to Listen",
    theme: "Connection",
    author: "Ahmed Hassan",
    location: "Cairo, Egypt",
    date: "2024-12-25",
    coordinates: [30.0444, 31.2357],
    preview:
      "My teenage daughter and I barely spoke for months. Then I decided to just listen...",
    content:
           "My teenage daughter and I barely spoke for months. Then I decided to just listen—really listen, without judgment or advice. It was harder than I expected. But slowly, she began to open up. Sometimes the greatest gift we can give is our full attention."
  },
  {
    id: 9,
    title: "The Music That Connected Us",
    theme: "Cultural",
    author: "Yuki Tanaka & Marcus Lee",
    location: "San Francisco, USA",
    date: "2024-12-20",
    coordinates: [37.7749, -122.4194],
    preview:
      "I didn't speak English when I moved. Music became our shared language...",
    content:
      "I moved to America from Japan when I was twelve and spent lunch in the music room playing piano. A classmate with a saxophone joined in. We jammed without words. He taught me jazz; I taught him classical. Years later, we still play together—proof that music builds bridges where words stumble."
  },
  {
    id: 10,
    title: "From Enemy to Brother",
    theme: "Hope",
    author: "David Cohen",
    location: "Jerusalem, Israel",
    date: "2024-12-15",
    coordinates: [31.7683, 35.2137],
    preview:
      "Two fathers, two children, one hospital waiting room. Our walls fell down...",
    content:
      "We were both in the hospital, our children in the same ward. We didn't talk politics. We talked fear, love, and hope. When his daughter died, I wept with him. When my son improved, he celebrated with me. We remain friends because we learned to see each other as fathers first—everything else came second."
  }
];

// Expose to window for threads.js
if (typeof window !== 'undefined') {
  window.sampleThreads = sampleThreads;
}
