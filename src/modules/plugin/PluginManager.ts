import { PluginData } from "./PluginData";
import { JsonBasedPluginFinder } from "./JsonBasedPluginFinder";
import { PluginDrawer } from "./PluginDrawer";
import { Plugin } from "./Plugin";
import * as path from 'path';
import * as childProcess from 'child_process';

/**
 * Plug-in manager
 * 
 * @author Thiago Delgado Pinto
 */
export class PluginManager {

    public readonly PLUGIN_DIR: string = '/plugins';

    public findAll = async (): Promise< PluginData[] > => {
        const dir = path.join( process.cwd(), this.PLUGIN_DIR );
        const finder = new JsonBasedPluginFinder( dir );
        const all = await finder.find();
        return this.sortByName( all );
    };
    
    public pluginWithName = async ( name: string ): Promise< PluginData | undefined > => {
        const all: PluginData[] = await this.findAll();
        return all.find( ( v ) => v.name.toLowerCase() === name.toLowerCase() );
    };

    public install = async ( pluginData: PluginData, drawer: PluginDrawer ): Promise< void > => {

        if ( ! pluginData.install ) {
            throw new Error( 'No "install" property found in the plugin file. Can\'t install it.' );
        }

        drawer.showPluginInstallStart( pluginData.name );
        this.runCommand( pluginData.install, drawer );
    };

    public uninstall = async ( pluginData: PluginData, drawer: PluginDrawer ): Promise< void > => {

        if ( ! pluginData.uninstall ) {
            throw new Error( 'No "uninstall" property found in the plugin file. Can\'t uninstall it.' );
        }

        drawer.showPluginUninstallStart( pluginData.name );
        this.runCommand( pluginData.uninstall, drawer );
    };


    /**
     * Tries to load a plug-in and to return its instance.
     * 
     * @param basePluginDirectory Base plug-in directory.
     * @param pluginData Plug-in data
     */
    public load = async (
        basePluginDirectory: string,
        pluginData: PluginData
    ): Promise< Plugin > => {

        const pluginClassFile = path.resolve( basePluginDirectory, pluginData.file );

        // Dynamically include the file
        const pluginClassFileContext = require( pluginClassFile );

        // Create an instance of the class
        const obj = this.createInstance( pluginClassFileContext, pluginData.class, [] );

        return obj as Plugin;        
    };


    private runCommand = ( command: string, drawer: PluginDrawer ): void => {

        const child = childProcess.exec( command );
        
        child.stdout.on( 'data', ( chunk ) => {
            drawer.showPluginExecutionOutput( chunk.toString() );
        } );

        child.stderr.on( 'data', ( chunk ) => {
            drawer.showPluginExecutionError( chunk.toString() );
        } );

        child.on( 'exit', ( code ) => {
            drawer.showPluginExecutionFinished( code );
        } );        
    };


    private sortByName = ( plugins: PluginData[] ): PluginData[] => {
        return plugins.sort( ( a: PluginData, b: PluginData ): number => {
            return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
        } );
    };

    /**
     * Returns an instance of a given class name.
     * 
     * @param context Object used as context.
     * @param className Class to be instantied.
     * @param args Constructor arguments.
     * @return An instance of the given class.
     */
    private createInstance = ( context: any, className: string, ...args: any[] ): any => {
        return new context[ className ]( ... args );
    };
        
}