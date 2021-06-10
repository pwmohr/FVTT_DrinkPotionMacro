main()

async function main() {
    // Is a single token selected?
    if (canvas.tokens.controlled.length != 1 ) {
        ui.notifications.error("Please select a single token");
        return;
    }
    let actor = canvas.tokens.controlled[0].actor;
    // console.log("Actor:", actor);

    // Does this token have a health potion?
    let healthPotion = actor.data.items.find(item => item.data.name == "Potion of Healing");
    // console.log("Health Potion:", healthPotion)

    if (healthPotion == null || healthPotion == undefined) {
        ui.notifications.error("No health potions left");
        return;
    }

    // Don't take the potion if actor is at full health
    if (actor.data.data.attributes.hp.value >= actor.data.data.attributes.hp.max) {
        ui.notifications.error("Already at max health, no potion needed");
        return;
    }

    // Action appears valid, so let's decrement the # of potions and delete the item
    // if there are none left 
    await healthPotion.update({ "data.quantity": healthPotion.data.data.quantity - 1 });
    if (healthPotion.data.data.quantity < 1) {
        healthPotion.delete();
    }

    // Add to the actor's health
    let roll = new Roll(healthPotion.data.data.damage.parts[0][0], {}).roll();
    // console.log("Roll is: ", roll);

    let newHealth = roll.total + actor.data.data.attributes.hp.value;
    if (newHealth > actor.data.data.attributes.hp.max) {
        newHealth = actor.data.data.attributes.hp.max;
    }
    await actor.update({ "data.attributes.hp.value": newHealth });
    ui.notifications.info(`${actor.data.name} took a healing potion and is now at ${actor.data.data.attributes.hp.value} hit points.`);
    //console.log("Actor: ", actor);
}