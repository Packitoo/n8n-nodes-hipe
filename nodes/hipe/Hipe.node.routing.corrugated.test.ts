// Mock all corrugated resource modules used by Hipe.node BEFORE importing Hipe
jest.mock('./Corrugated/CorrugatedFormats/actions', () => {
  return {
    RESOURCE: 'corrugatedFormat',
    ACTIONS: {
      create: { execute: jest.fn().mockResolvedValue([{ json: { routed: 'formats/create' } }]) },
      get: { execute: jest.fn().mockResolvedValue([{ json: { routed: 'formats/get' } }]) },
      getMany: { execute: jest.fn().mockResolvedValue([{ json: { routed: 'formats/getMany' } }]) },
      update: { execute: jest.fn().mockResolvedValue([{ json: { routed: 'formats/update' } }]) },
    },
    buildProperties: () => ['corrugatedFormat', []],
  };
});
jest.mock('./Corrugated/CorrugatedFlutes/actions', () => {
  return {
    RESOURCE: 'corrugatedFlute',
    ACTIONS: {
      create: { execute: jest.fn().mockResolvedValue([{ json: { routed: 'flutes/create' } }]) },
      get: { execute: jest.fn().mockResolvedValue([{ json: { routed: 'flutes/get' } }]) },
      getMany: { execute: jest.fn().mockResolvedValue([{ json: { routed: 'flutes/getMany' } }]) },
      update: { execute: jest.fn().mockResolvedValue([{ json: { routed: 'flutes/update' } }]) },
    },
    buildProperties: () => ['corrugatedFlute', []],
  };
});
jest.mock('./Corrugated/CorrugatedLiners/actions', () => {
  return {
    RESOURCE: 'corrugatedLiner',
    ACTIONS: {
      create: { execute: jest.fn().mockResolvedValue([{ json: { routed: 'liners/create' } }]) },
      get: { execute: jest.fn().mockResolvedValue([{ json: { routed: 'liners/get' } }]) },
      getMany: { execute: jest.fn().mockResolvedValue([{ json: { routed: 'liners/getMany' } }]) },
      update: { execute: jest.fn().mockResolvedValue([{ json: { routed: 'liners/update' } }]) },
    },
    buildProperties: () => ['corrugatedLiner', []],
  };
});
jest.mock('./Corrugated/CorrugatedMaterials/actions', () => {
  return {
    RESOURCE: 'corrugatedMaterial',
    ACTIONS: {
      create: { execute: jest.fn().mockResolvedValue([{ json: { routed: 'materials/create' } }]) },
      get: { execute: jest.fn().mockResolvedValue([{ json: { routed: 'materials/get' } }]) },
      getMany: { execute: jest.fn().mockResolvedValue([{ json: { routed: 'materials/getMany' } }]) },
      update: { execute: jest.fn().mockResolvedValue([{ json: { routed: 'materials/update' } }]) },
    },
    buildProperties: () => ['corrugatedMaterial', []],
  };
});
jest.mock('./Corrugated/CorrugatedMaterialCompositions/actions', () => {
  return {
    RESOURCE: 'corrugatedMaterialComposition',
    ACTIONS: {
      getMany: {
        execute: jest.fn().mockResolvedValue([
          { json: { routed: 'materialCompositions/getMany' } },
        ]),
      },
    },
    buildProperties: () => ['corrugatedMaterialComposition', []],
  };
});
jest.mock('./Corrugated/CorrugatedMaterialCompositionPrices/actions', () => {
  return {
    RESOURCE: 'corrugatedMaterialCompositionPrice',
    ACTIONS: {
      getMany: {
        execute: jest.fn().mockResolvedValue([
          { json: { routed: 'materialCompositionPrices/getMany' } },
        ]),
      },
    },
    buildProperties: () => ['corrugatedMaterialCompositionPrice', []],
  };
});
jest.mock('./Corrugated/CorrugatedSuppliers/actions', () => {
  return {
    RESOURCE: 'corrugatedSupplier',
    ACTIONS: {
      create: { execute: jest.fn().mockResolvedValue([{ json: { routed: 'suppliers/create' } }]) },
      getMany: { execute: jest.fn().mockResolvedValue([{ json: { routed: 'suppliers/getMany' } }]) },
      update: { execute: jest.fn().mockResolvedValue([{ json: { routed: 'suppliers/update' } }]) },
    },
    buildProperties: () => ['corrugatedSupplier', []],
  };
});

import { Hipe } from './Hipe.node';

const formatsModule = require('./Corrugated/CorrugatedFormats/actions');
const flutesModule = require('./Corrugated/CorrugatedFlutes/actions');
const linersModule = require('./Corrugated/CorrugatedLiners/actions');
const materialsModule = require('./Corrugated/CorrugatedMaterials/actions');
const compositionsModule = require('./Corrugated/CorrugatedMaterialCompositions/actions');
const pricesModule = require('./Corrugated/CorrugatedMaterialCompositionPrices/actions');
const suppliersModule = require('./Corrugated/CorrugatedSuppliers/actions');

function makeCtx(resource: string, operation: string = 'getMany') {
  const items = [{ json: {} }];
  return {
    items,
    self: {
      getInputData: () => items,
      getNodeParameter: (name: string) => {
        if (name === 'resource') return resource;
        if (name === 'operation') return operation;
        return 'getMany';
      },
      logger: { debug: jest.fn(), error: jest.fn() },
      getNode: () => ({}),
    } as any,
  };
}

describe('Hipe node routing - Corrugated getMany operations', () => {
  it('routes to Corrugated Formats getMany', async () => {
    const node = new Hipe();
    const { self } = makeCtx('corrugatedFormat');
    const out = await (node as any).execute.call(self);
    expect(formatsModule.ACTIONS.getMany.execute).toHaveBeenCalledTimes(1);
    expect(out).toEqual([[{ json: { routed: 'formats/getMany' } }]]);
  });

  it('routes to Corrugated Flutes getMany', async () => {
    const node = new Hipe();
    const { self } = makeCtx('corrugatedFlute');
    const out = await (node as any).execute.call(self);
    expect(flutesModule.ACTIONS.getMany.execute).toHaveBeenCalledTimes(1);
    expect(out).toEqual([[{ json: { routed: 'flutes/getMany' } }]]);
  });

  it('routes to Corrugated Liners getMany', async () => {
    const node = new Hipe();
    const { self } = makeCtx('corrugatedLiner');
    const out = await (node as any).execute.call(self);
    expect(linersModule.ACTIONS.getMany.execute).toHaveBeenCalledTimes(1);
    expect(out).toEqual([[{ json: { routed: 'liners/getMany' } }]]);
  });

  it('routes to Corrugated Materials getMany', async () => {
    const node = new Hipe();
    const { self } = makeCtx('corrugatedMaterial');
    const out = await (node as any).execute.call(self);
    expect(materialsModule.ACTIONS.getMany.execute).toHaveBeenCalledTimes(1);
    expect(out).toEqual([[{ json: { routed: 'materials/getMany' } }]]);
  });

  it('routes to Corrugated MaterialCompositions getMany', async () => {
    const node = new Hipe();
    const { self } = makeCtx('corrugatedMaterialComposition');
    const out = await (node as any).execute.call(self);
    expect(compositionsModule.ACTIONS.getMany.execute).toHaveBeenCalledTimes(1);
    expect(out).toEqual([[{ json: { routed: 'materialCompositions/getMany' } }]]);
  });

  it('routes to Corrugated MaterialCompositionPrices getMany', async () => {
    const node = new Hipe();
    const { self } = makeCtx('corrugatedMaterialCompositionPrice');
    const out = await (node as any).execute.call(self);
    expect(pricesModule.ACTIONS.getMany.execute).toHaveBeenCalledTimes(1);
    expect(out).toEqual([[{ json: { routed: 'materialCompositionPrices/getMany' } }]]);
  });

  it('routes to Corrugated Suppliers getMany', async () => {
    const node = new Hipe();
    const { self } = makeCtx('corrugatedSupplier');
    const out = await (node as any).execute.call(self);
    expect(suppliersModule.ACTIONS.getMany.execute).toHaveBeenCalledTimes(1);
    expect(out).toEqual([[{ json: { routed: 'suppliers/getMany' } }]]);
  });

  it('routes to Corrugated Formats create', async () => {
    const node = new Hipe();
    const { self } = makeCtx('corrugatedFormat', 'create');
    const out = await (node as any).execute.call(self);
    expect(formatsModule.ACTIONS.create.execute).toHaveBeenCalledTimes(1);
    expect(out).toEqual([[{ json: { routed: 'formats/create' } }]]);
  });

  it('routes to Corrugated Formats get', async () => {
    const node = new Hipe();
    const { self } = makeCtx('corrugatedFormat', 'get');
    const out = await (node as any).execute.call(self);
    expect(formatsModule.ACTIONS.get.execute).toHaveBeenCalledTimes(1);
    expect(out).toEqual([[{ json: { routed: 'formats/get' } }]]);
  });

  it('routes to Corrugated Formats update', async () => {
    const node = new Hipe();
    const { self } = makeCtx('corrugatedFormat', 'update');
    const out = await (node as any).execute.call(self);
    expect(formatsModule.ACTIONS.update.execute).toHaveBeenCalledTimes(1);
    expect(out).toEqual([[{ json: { routed: 'formats/update' } }]]);
  });

  it('routes to Corrugated Flutes create', async () => {
    const node = new Hipe();
    const { self } = makeCtx('corrugatedFlute', 'create');
    const out = await (node as any).execute.call(self);
    expect(flutesModule.ACTIONS.create.execute).toHaveBeenCalledTimes(1);
    expect(out).toEqual([[{ json: { routed: 'flutes/create' } }]]);
  });

  it('routes to Corrugated Flutes get', async () => {
    const node = new Hipe();
    const { self } = makeCtx('corrugatedFlute', 'get');
    const out = await (node as any).execute.call(self);
    expect(flutesModule.ACTIONS.get.execute).toHaveBeenCalledTimes(1);
    expect(out).toEqual([[{ json: { routed: 'flutes/get' } }]]);
  });

  it('routes to Corrugated Flutes update', async () => {
    const node = new Hipe();
    const { self } = makeCtx('corrugatedFlute', 'update');
    const out = await (node as any).execute.call(self);
    expect(flutesModule.ACTIONS.update.execute).toHaveBeenCalledTimes(1);
    expect(out).toEqual([[{ json: { routed: 'flutes/update' } }]]);
  });

  it('routes to Corrugated Liners create', async () => {
    const node = new Hipe();
    const { self } = makeCtx('corrugatedLiner', 'create');
    const out = await (node as any).execute.call(self);
    expect(linersModule.ACTIONS.create.execute).toHaveBeenCalledTimes(1);
    expect(out).toEqual([[{ json: { routed: 'liners/create' } }]]);
  });

  it('routes to Corrugated Liners get', async () => {
    const node = new Hipe();
    const { self } = makeCtx('corrugatedLiner', 'get');
    const out = await (node as any).execute.call(self);
    expect(linersModule.ACTIONS.get.execute).toHaveBeenCalledTimes(1);
    expect(out).toEqual([[{ json: { routed: 'liners/get' } }]]);
  });

  it('routes to Corrugated Liners update', async () => {
    const node = new Hipe();
    const { self } = makeCtx('corrugatedLiner', 'update');
    const out = await (node as any).execute.call(self);
    expect(linersModule.ACTIONS.update.execute).toHaveBeenCalledTimes(1);
    expect(out).toEqual([[{ json: { routed: 'liners/update' } }]]);
  });

  it('routes to Corrugated Materials create', async () => {
    const node = new Hipe();
    const { self } = makeCtx('corrugatedMaterial', 'create');
    const out = await (node as any).execute.call(self);
    expect(materialsModule.ACTIONS.create.execute).toHaveBeenCalledTimes(1);
    expect(out).toEqual([[{ json: { routed: 'materials/create' } }]]);
  });

  it('routes to Corrugated Materials get', async () => {
    const node = new Hipe();
    const { self } = makeCtx('corrugatedMaterial', 'get');
    const out = await (node as any).execute.call(self);
    expect(materialsModule.ACTIONS.get.execute).toHaveBeenCalledTimes(1);
    expect(out).toEqual([[{ json: { routed: 'materials/get' } }]]);
  });

  it('routes to Corrugated Materials update', async () => {
    const node = new Hipe();
    const { self } = makeCtx('corrugatedMaterial', 'update');
    const out = await (node as any).execute.call(self);
    expect(materialsModule.ACTIONS.update.execute).toHaveBeenCalledTimes(1);
    expect(out).toEqual([[{ json: { routed: 'materials/update' } }]]);
  });

  it('routes to Corrugated Suppliers create', async () => {
    const node = new Hipe();
    const { self } = makeCtx('corrugatedSupplier', 'create');
    const out = await (node as any).execute.call(self);
    expect(suppliersModule.ACTIONS.create.execute).toHaveBeenCalledTimes(1);
    expect(out).toEqual([[{ json: { routed: 'suppliers/create' } }]]);
  });

  it('routes to Corrugated Suppliers update', async () => {
    const node = new Hipe();
    const { self } = makeCtx('corrugatedSupplier', 'update');
    const out = await (node as any).execute.call(self);
    expect(suppliersModule.ACTIONS.update.execute).toHaveBeenCalledTimes(1);
    expect(out).toEqual([[{ json: { routed: 'suppliers/update' } }]]);
  });
});
