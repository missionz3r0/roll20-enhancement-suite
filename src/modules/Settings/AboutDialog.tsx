import {DialogBase} from "../../utils/DialogBase";
import {getExtUrlFromPage} from "../../utils/MiscUtils";
import {Dialog, DialogHeader, DialogBody} from "../../utils/DialogComponents";
import {DOM} from "../../utils/DOM";
import {Config} from "../../utils/Config";

declare namespace build {
    export const R20ES_VERSION: string;
    export const R20ES_COMMIT: string;
    export const R20ES_BRANCH: string;
    export const R20ES_BROWSER: string;
}

export default class AboutDialog extends DialogBase<null> {
    private logoUrl: string = null;

    public show = this.internalShow;

    constructor() {
        super(null, {
            maxHeight: "100%"
        }, true); // recenter workaround

        getExtUrlFromPage("logo.svg", 5000)
            .then((url: string) => this.logoUrl = url)
            .catch(err => console.error(`Failed to get logo.svg: ${err}`));
    }

    private openUrl(url: string) {
        var redir = window.open(url, "_blank");
        redir.location;
    }

    protected render = (): HTMLElement => {
        const mkEntry = (what, data) =>
            <div>
                {what}
                <span style={{float: "right"}}>{data}</span>
            </div>

        return (
            <Dialog>
                <DialogHeader style={{textAlign: "center"}}>
                    <a href={"javascript:void(0) // workaround for underpopup dialog from roll20 regarding leaving the site"}
                       onClick={() => this.openUrl(Config.website)}>
                        <h1 style="color: blue">VTT Enhancement Suite</h1>
                        <small>aka R20ES</small>
                    </a>
                    <h2>Version {build.R20ES_VERSION}</h2>
                    <h3>Built for {build.R20ES_BROWSER}, <i>Roll20</i></h3>
                </DialogHeader>


                <DialogBody>

                    <div style={{display: "flex"}}>

                        <div style={{display: "flex", flexDirection: "column", justifyContent: "center"}}>
                            <div>
                                <b>Built by</b>
                                <p>Justas "stormy" Dabrila, Giddy</p>
                            </div>

                            <div>
                                <b>And other work by</b>
                                <p style={{maxWidth: "180px"}}>
                                    Jay "Vanguard" Fothergill, Ryan Wenneker
                                </p>
                            </div>

                            <div>
                                <b>Tested by</b>
                                <p style={{maxWidth: "180px"}}>
                                    Axecleft, TEU_Snoopy, keablah, Nikolay, Colorblind,
                                    DoomRice, Daj, Angor de Redjak, Ryan Wenneker, Tielc,
                                    Giddy, Grigdusher, Knilk, Dominic, Neverr, SmoothAsFelt,
                                    dunedain, Vlad.D, Mike W, Hagenkopter, Ackerfe, shaosam
                                </p>
                            </div>
                        </div>

                        <div style={{paddingRight: "8px", paddingLeft: "8px"}}>
                            <img src={this.logoUrl} alt="Logo"/>
                        </div>

                        <div style={{display: "flex", flexDirection: "column", direction: "rtl", justifyContent: "center"}}>
                            <div>
                                <b>With contributions from</b>
                                <div style={{maxWidth: "180px"}}>
                                    Mike, Aaron, Blurn Glanstone, Tobyn, Fredrik, Ryan Wenneker,
                                    BuckeyeFan79, Jakob, Daniel (Daj), Morris Kennedy, KarateHawk,
                                    Jason Backus, Tielc, Spencer Oldemeyer, Hawks, S.Ziterman,
                                    Worst DM Ever, Curtis T, TEU_Snoopy, Jeremy, Alex, Teddy,
                                    John Finley, Shemetz, Jon, Mike Schaeffer, Anthony Diaz,
                                    Patrick Lane, Raphael Riedl, GrapeDrank, Michael Graeper,
                                    Michael Wilson, Bruce Frankford, Shona Dixon, Gabriel Diedrich,
                                    Kyle B. Bachman, The Griffin Moon Collaborative
                                </div>
                            </div>
                        </div>
                    </div>


                    <hr/>

                    <div style={{display: "grid", gridTemplateColumns: "auto auto"}}>
                        <span>Branch</span>
                        <span>{build.R20ES_BRANCH}</span>

                        <span>Commit</span>
                        <span>{build.R20ES_COMMIT}</span>
                    </div>

                    <div style={{marginTop: "16px", marginBottom: "16px", textAlign: "center"}}>

                        <span style={{marginRight: "8px"}}>
                            <a href={"javascript:void(0) // workaround for underpopup dialog from roll20 regarding leaving the site"}
                               onClick={() => this.openUrl(Config.discordInvite)}>
                                <img height="32" width="32" className="discord-logo"
                                     src="https://discordapp.com/assets/41484d92c876f76b20c7f746221e8151.svg"/>
                            </a>
                        </span>

                        <span style={{marginRight: "8px"}}>
                            <a href={"javascript:void(0) // workaround for underpopup dialog from roll20 regarding leaving the site"}
                               onClick={() => this.openUrl("https://github.com/SSStormy/roll20-enhancement-suite/")}>
                                <img height="32" width="32" className="github-logo"
                                     src="https://unpkg.com/simple-icons@latest/icons/github.svg"/>
                            </a>
                        </span>

                        <span>
                            <a href={"javascript:void(0) // workaround for underpopup dialog from roll20 regarding leaving the site"}
                               onClick={() => this.openUrl(Config.contributeUrl)}>
                                <img height="32" width="32"
                                     src="https://www.buymeacoffee.com/assets/img/BMC-btn-logo.svg"
                                     alt="Buy me a coffee"/>
                            </a>
                        </span>

                    </div>

                </DialogBody>

                <section style={{margin: "20px"}}>
                    <input
                        className="btn btn-primary"
                        style={{width: "100%", height: "auto", boxSizing: "border-box"}}
                        type="button"
                        onClick={this.close}
                        value="OK"/>
                </section>

            </Dialog> as any
        )
    }
}
