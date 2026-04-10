# Paired Items (Item Linking)

References:
- https://docs.n8n.io/integrations/creating-nodes/build/reference/paired-items/
- https://docs.n8n.io/data/data-mapping/data-item-linking/item-linking-concepts/

## What is pairedItem?

n8n processes data as **arrays of items**. When a workflow has multiple nodes chained together, n8n needs to know which output item came from which input item — this is called **item linking**.

`pairedItem` is the property on each output item that declares: "I was produced by input item number X." This creates a traceable chain across the entire workflow, from trigger to final output.

### How n8n uses it internally

When you write an expression like `{{ $('Customer Lookup').item.json.name }}` in a downstream node, n8n walks the item linking chain **backwards** to find the corresponding item in "Customer Lookup". Without `pairedItem`, n8n cannot resolve which item to use, and the expression fails or returns the wrong data.

This is not just for error handling — it's **core to how n8n evaluates expressions across nodes**.

## Why it matters

Without `pairedItem`:
- **Expressions break**: downstream nodes using `$('Previous Node').item.json.field` cannot resolve which item to reference — n8n has no way to walk back the chain
- **Error tracking is blind**: when `continueOnFail()` catches an error, n8n cannot map it back to the source item
- **UI item counts mislead**: the n8n editor cannot display accurate item-to-item correspondence
- **Split/Merge workflows break**: if items are split into batches and merged back, n8n loses track of which output belongs to which original input

## When to use it

**Always.** Every HIPE node action that loops over input items and returns output items should set `pairedItem`.

For 1:1 operations (Get, Create, Update, Delete) where each input produces exactly one output, set `pairedItem: { item: i }` where `i` is the loop index.

For 1:N operations (List) where one input may produce multiple outputs, each output item should still reference the input item that triggered the API call.

## How to use it

### Standard pattern (1:1 — Get, Create, Update, Delete)

```typescript
export async function execute(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];

  for (let i = 0; i < items.length; i++) {
    try {
      const response = await this.helpers.requestWithAuthentication.call(
        this, 'hipeApi', { /* ... */ },
      );
      // Link output to the input item that produced it
      returnData.push({ json: response, pairedItem: { item: i } });
    } catch (error) {
      if (this.continueOnFail()) {
        // Errors must also be linked to their source input
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
        continue;
      }
      throw error;
    }
  }
  return returnData;
}
```

### List pattern (1:N)

```typescript
for (let i = 0; i < items.length; i++) {
  const results = await fetchAllPages(/* ... */);
  // Every result item links back to input item i
  for (const result of results) {
    returnData.push({ json: result, pairedItem: { item: i } });
  }
}
```

### Multiple inputs (merge nodes)

If a node combines multiple inputs, use the optional `input` field:

```typescript
returnData.push({
  json: mergedData,
  pairedItem: {
    item: i,    // index of the item within that input
    input: 0,   // which input stream (0-based)
  },
});
```

## What NOT to do

```typescript
// BAD: no pairedItem — breaks downstream expressions
returnData.push({ json: response });

// BAD: wrong index — links to the wrong input item
returnData.push({ json: response, pairedItem: { item: 0 } }); // always 0!
```

## Shorthand

`pairedItem` accepts either an object or a plain number:

```typescript
// These are equivalent:
{ json: data, pairedItem: { item: i } }
{ json: data, pairedItem: i }
```

The object form is preferred in HIPE nodes for clarity and consistency, and to allow adding the `input` field when needed.
