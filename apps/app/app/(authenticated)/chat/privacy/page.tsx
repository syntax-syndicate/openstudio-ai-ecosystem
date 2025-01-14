'use client';
import { Mdx } from '@/app/(authenticated)/chat/components/mdx';
import { privacyPolicy } from '@/config/privacy';
import { Flex } from '@repo/design-system/components/ui/flex';

const PrivacyPage = () => {
  return (
    <Flex className="w-full" justify="center">
      <Flex className="w-full py-12 md:max-w-[600px]">
        <Mdx
          message={privacyPolicy}
          animate={false}
          messageId="privacy"
          size="sm"
        />
      </Flex>
    </Flex>
  );
};
export default PrivacyPage;
