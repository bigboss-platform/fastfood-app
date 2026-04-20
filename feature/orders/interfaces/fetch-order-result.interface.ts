import type { IOrder } from "./order.interface"

export interface IFetchOrderResult {
    order: IOrder
    notFound: boolean
}
