# TODO: Customize Relationship Edges to Draw.io Style with PK/FK Indicators

## Tasks
- [ ] Update ArrowMarkers.tsx to refine arrow styles to match Draw.io ER diagram notations (e.g., ensure proper arrow and crow's foot placements).
- [ ] Modify RelationshipEdge.tsx to include PK/FK indicators in the edge label (e.g., show which side is Primary Key and Foreign Key).
- [ ] Verify that table connections with arrows display correctly and include the customized styles.
- [ ] Test the changes in the application to ensure functionality.

## Notes
- Draw.io style: One-to-one uses arrows on both ends, one-to-many uses arrow on one side and crow's foot on many, many-to-many uses crow's foot on both.
- Add PK/FK labels to clarify the relationship sides.
