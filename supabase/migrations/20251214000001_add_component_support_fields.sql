-- Add support fields to components table for public component bank
-- These fields help non-IT donors easily place orders and provide delivery information

ALTER TABLE public.components
ADD COLUMN IF NOT EXISTS purchase_link TEXT,
ADD COLUMN IF NOT EXISTS delivery_address TEXT,
ADD COLUMN IF NOT EXISTS delivery_phone TEXT;

-- Add comments to document the fields
COMMENT ON COLUMN public.components.purchase_link IS 
  'Link đặt hàng linh kiện (URL từ các trang thương mại điện tử như Shopee, Lazada, Tiki, v.v.)';

COMMENT ON COLUMN public.components.delivery_address IS 
  'Địa chỉ nhận hàng để người hỗ trợ có thể đặt hàng trực tiếp gửi đến';

COMMENT ON COLUMN public.components.delivery_phone IS 
  'Số điện thoại nhận hàng để người hỗ trợ có thể cung cấp khi đặt hàng';
