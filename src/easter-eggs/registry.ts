export const ORB_IDS = ['orb-1', 'orb-2', 'orb-3', 'orb-4', 'orb-5', 'orb-6', 'orb-7'] as const

export interface EggDef {
  id: string
  label: string
  hint: string
  kind: 'orb' | 'click' | 'combo' | 'combo-key'
}

export const EGGS: EggDef[] = [
  { id: 'orb-1', label: 'Lantern Glimmer', hint: 'A little light hides where the petals thin.', kind: 'orb' },
  { id: 'orb-2', label: 'Petal Secret', hint: 'Look between the blossoms at dawn.', kind: 'orb' },
  { id: 'orb-3', label: 'Moonlit Whisper', hint: 'Evening keeps its own small lanterns.', kind: 'orb' },
  { id: 'orb-4', label: 'Knot of Fate', hint: 'A thread loops back where the story began.', kind: 'orb' },
  { id: 'orb-5', label: 'Rice Paper Spark', hint: 'Something glows near the folded paper.', kind: 'orb' },
  { id: 'orb-6', label: 'Dusk Ember', hint: 'The last warm light before the stars.', kind: 'orb' },
  { id: 'orb-7', label: 'Wishing Star', hint: 'One more light waits to be noticed.', kind: 'orb' },
  { id: 'ramen', label: 'Midnight Noodles', hint: 'Two bowls are better than one.', kind: 'combo' },
  { id: 'butterfly', label: 'Paper Wings', hint: 'A quiet corner likes to flutter.', kind: 'click' },
  { id: 'straw-hat', label: "Traveller's Hat", hint: 'A souvenir casts a curious shadow.', kind: 'click' },
  { id: 'leaf-swirl', label: 'Turning Leaf', hint: 'Autumn has a second story.', kind: 'click' },
  { id: 'konami', label: 'Old Rhythm', hint: 'Some melodies are typed, not hummed.', kind: 'combo-key' },
]
