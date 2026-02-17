'use client';

import { ModuleRegistry } from 'ag-grid-community';
import {
    ClientSideRowModelModule,
    ValidationModule,
    TextEditorModule,
    NumberEditorModule,
    DateFilterModule,
    TextFilterModule,
    NumberFilterModule,
    CellStyleModule,
    ColumnAutoSizeModule,
    SelectEditorModule,
    CustomFilterModule
} from 'ag-grid-community';

// Register all required modules once
ModuleRegistry.registerModules([
    ClientSideRowModelModule,
    ValidationModule,
    TextEditorModule,
    NumberEditorModule,
    SelectEditorModule,
    DateFilterModule,
    TextFilterModule,
    NumberFilterModule,
    CellStyleModule,
    ColumnAutoSizeModule,
    CustomFilterModule
]);
