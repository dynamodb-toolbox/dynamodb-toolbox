export const chunk = <ITEM>(items: ITEM[], chunkSize: number): ITEM[][] => {
  // important not to mute the original array
  const itemsClone: ITEM[] = [...items]
  const chunkedItems: ITEM[][] = []

  while (itemsClone.length > 0) {
    chunkedItems.push(itemsClone.splice(0, chunkSize))
  }

  return chunkedItems
}
