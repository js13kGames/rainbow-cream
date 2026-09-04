import { GameVars, toPixelSize } from "../../game-variables";
import { MenuType } from "../../enum/menu-type";
import { createElem, setElemSize } from "../../utilities/elem-utilities";
import { genSmallBox } from "../../utilities/box-generator";
import { drawPixelTextInCanvas } from "../../utilities/text";
import { StaffUI } from "./submenus/staff-ui";
import { MenuEditUI } from "./submenus/menu_edit_ui";
import { UnicornHandlingUI } from "./submenus/unicorn-handling";

export class ManagementUI {
    constructor(game, parentDiv) {
        this.game = game;
        this.currentMenu = MenuType.NONE;

        this.managementDiv = createElem(parentDiv, "div", "management");

        this.managementCanv = createElem(this.managementDiv, "canvas");
        this.managementCtx = this.managementCanv.getContext("2d");

        this.menuEditMenu = new MenuEditUI(game, this.managementDiv);
        this.menuEditBtn = createElem(this.managementDiv, "canvas", null, null, null, null, null, () => {
            if (this.game.management.isMenuEditUnlocked) {
                this.openMenu(MenuType.MENU_EDIT);
            } else {
                this.game.management.unlockMenuEdit();
            }
        });
        this.menuEditBtnCtx = this.menuEditBtn.getContext("2d");

        this.staffMenu = new StaffUI(game, this.managementDiv);
        this.staffBtn = createElem(this.managementDiv, "canvas", null, null, null, null, null, () => {
            if (this.game.management.isStaffUnlocked) {
                this.openMenu(MenuType.STAFF);
            } else {
                this.game.management.unlockStaff();
            }
        });
        this.staffBtnCtx = this.staffBtn.getContext("2d");

        this.unicornMenu = new UnicornHandlingUI(game, this.managementDiv);
        this.unicornBtn = createElem(this.managementDiv, "canvas", null, null, null, null, null, () => {
            if (this.game.management.isUnicornHandlingUnlocked) {
                this.openMenu(MenuType.UNICORN_HANDLING);
            } else {
                this.game.management.unlockUnicornHandling();
            }
        });
        this.unicornBtnCtx = this.unicornBtn.getContext("2d");

        this.resize();
    }

    openMenu(newMenu) {
        this.currentMenu = newMenu;

        this.menuEditMenu.hide();
        this.staffMenu.hide();
        this.unicornMenu.hide();

        if (this.currentMenu === MenuType.MENU_EDIT) this.menuEditMenu.show();
        else if (this.currentMenu === MenuType.STAFF) this.staffMenu.show();
        else if (this.currentMenu === MenuType.UNICORN_HANDLING) this.unicornMenu.show();
    }

    resize() {
        this.xPos = toPixelSize(8);
        this.yPos = toPixelSize(8);

        setElemSize(this.managementCanv, toPixelSize(80), toPixelSize(56));
        this.managementCanv.style.translate = this.xPos + 'px ' + this.yPos + 'px';

        setElemSize(this.menuEditBtn, toPixelSize(74), toPixelSize(12));
        this.menuEditBtn.style.translate = (this.xPos + toPixelSize(3)) + 'px ' + (this.yPos + toPixelSize(13)) + 'px';

        setElemSize(this.staffBtn, toPixelSize(74), toPixelSize(12));
        this.staffBtn.style.translate = (this.xPos + toPixelSize(3)) + 'px ' + (this.yPos + this.menuEditBtn.height + toPixelSize(15)) + 'px';

        setElemSize(this.unicornBtn, toPixelSize(74), toPixelSize(12));
        this.unicornBtn.style.translate = (this.xPos + toPixelSize(3)) + 'px ' + (this.yPos + this.menuEditBtn.height + this.staffBtn.height + toPixelSize(17)) + 'px';
    }

    draw() {
        if (this.currentMenu === MenuType.MENU_EDIT) this.menuEditMenu.draw(this.xPos, this.yPos + this.managementCanv.height);
        else if (this.currentMenu === MenuType.STAFF) this.staffMenu.draw(this.xPos, this.yPos + this.managementCanv.height);
        else if (this.currentMenu === MenuType.UNICORN_HANDLING) this.unicornMenu.draw(this.xPos, this.yPos + this.managementCanv.height);

        this.drawButtons();
    }

    drawButtons() {
        this.managementCtx.clearRect(0, 0, this.managementCanv.width, this.managementCanv.height);
        genSmallBox(this.managementCtx, 0, 0, 79, 55, toPixelSize(1), "#3e3846", "#1b1116");
        drawPixelTextInCanvas("management", this.managementCtx, toPixelSize(1), 40, 8, "#00bcd4", 1);

        let isUnlocked = this.game.management.isMenuEditUnlocked;
        let cost = this.game.management.menuEditUnlockValue;
        let canAfford = this.game.playerMoney >= cost;

        this.menuEditBtnCtx.clearRect(0, 0, this.menuEditBtn.width, this.menuEditBtn.height);
        genSmallBox(this.menuEditBtnCtx, 0, 0, 73, 11, toPixelSize(1), "#9bf2fa" + (isUnlocked || canAfford ? "" : "55"), "#1b1116");
        drawPixelTextInCanvas(isUnlocked ? "menu edit" : "menu $-" + cost, this.menuEditBtnCtx, toPixelSize(1), 37, 6, "#9bf2fa" + (isUnlocked || canAfford ? "" : "55"));

        isUnlocked = this.game.management.isStaffUnlocked;
        cost = this.game.management.staffUnlockValue;
        canAfford = this.game.playerMoney >= cost;

        this.staffBtnCtx.clearRect(0, 0, this.staffBtn.width, this.staffBtn.height);
        genSmallBox(this.staffBtnCtx, 0, 0, 73, 11, toPixelSize(1), "#9bf2fa" + (isUnlocked || canAfford ? "" : "55"), "#1b1116");
        drawPixelTextInCanvas(isUnlocked ? "Staff managing" : "Staff $-" + cost, this.staffBtnCtx, toPixelSize(1), 37, 6, "#9bf2fa" + (isUnlocked || canAfford ? "" : "55"));

        isUnlocked = this.game.management.isUnicornHandlingUnlocked;
        cost = this.game.management.unicornHandlingUnlockedValue;
        canAfford = this.game.playerMoney >= cost;

        this.unicornBtnCtx.clearRect(0, 0, this.unicornBtn.width, this.unicornBtn.height);
        genSmallBox(this.unicornBtnCtx, 0, 0, 73, 11, toPixelSize(1), "#9bf2fa" + (isUnlocked || canAfford ? "" : "55"), "#1b1116");
        drawPixelTextInCanvas(isUnlocked ? "unicorn handling" : "unicorn $-" + cost, this.unicornBtnCtx, toPixelSize(1), 37, 6, "#9bf2fa" + (isUnlocked || canAfford ? "" : "55"));
    }
}
