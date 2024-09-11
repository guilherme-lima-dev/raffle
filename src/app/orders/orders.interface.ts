export interface IOrdersQueryDTO {
    customer_name: any;
    customer_phone?: any;
    status?: any;
    order_date?: any;
    external_id?: any;
}

export interface IOrdersPersistDTO {
    customer_name: any;
    customer_phone: any;
    status: any;
    order_date: any;
    external_id: any;
}
