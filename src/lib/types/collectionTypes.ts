export interface collection {
  id: string
  userId: string
  collectionName: string
}

export interface collectionItemTypes {
  collectionId: string
  productId: string
}

export interface Collections {
  collections: collection
  collection_items: collectionItemTypes
}

export interface CollectionsWithCount {
  collectionId: string
  collectionName: string
  productCount: string
}

export interface collectionCProps {
  collectionsWithCounts: CollectionsWithCount[]
  productsInCollection: productCollectionsType[]
}

export interface productCollectionsType {
  name: string
  productId: string
  thumbnail: string
}
// export interface CollectionTypes {
//   collections: Collections[]
// }
