import { DeliveryType } from "../enums/delivery-type.enum"

export function deliveryTypeToApi(type: DeliveryType): string {
    if (type === DeliveryType.PICKUP) return "recogida"
    return "entrega"
}
