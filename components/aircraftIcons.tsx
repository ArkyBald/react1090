import aircraftPaths, { aircraftNames } from "../public/aircraftSVG"

export default function AircraftIcon(props: {category: string, type?: string}) {
    let iconSRC = './aircraftSVG'
    let iconSize = 1

    // TODO use https://codepen.io/sosuke/pen/Pjoqqp to create light and dark mode filters
    const dark = 'invert(100%) sepia(100%) saturate(0%) hue-rotate(201deg) brightness(106%) contrast(106%)'
    
    if (props.category == undefined) return <img src={iconSRC.concat(findIconUsingCategory(""))}  width={30} height={30} style={{ filter: dark }} />
    const category = props.category.toLowerCase().trim();
    const type = props.type?.toLowerCase().trim();
    

    if (type) {
        if (aircraftNames.find((acftName) => acftName == type)) {
            let [iconPath, size] = aircraftPaths[type]
            iconSize = size
            iconSRC = iconSRC.concat(iconPath)
        } else 
        {
            let genericAircraftName = aircraftNames.find((acftName) => acftName.slice(0, acftName.length - 1) == type.toLowerCase().slice(0, type.length - 1))
            if (genericAircraftName !== undefined) 
                {iconSRC = iconSRC.concat(genericAircraftName)}
            else 
                {
                    let [iconPath, size] = findIconUsingCategory(category)
                    iconSize = size
                    iconSRC = iconSRC.concat(iconPath)
                }
        }
    } else {
                let [iconPath, size] = findIconUsingCategory(category)
                iconSize = size
                iconSRC = iconSRC.concat(iconPath)
            }


    console.log(iconSRC)
    return (
        <img src={iconSRC} alt={`${category} ${type}`} width={30 * iconSize} height={30 * iconSize} style={{ filter: dark }} />
    )

}

function findIconUsingCategory(category : string) : [string, number] {
    if (category == undefined) return aircraftPaths["f5"]
    if (aircraftNames.find((value) => value == category) !== undefined) {
            return aircraftPaths[category]
        }
    else
        switch (category) {
            // TODO add cases any other categories not referenced in aircraftSVG folder
            default:
                return aircraftPaths["a0"]
        }
}

    
